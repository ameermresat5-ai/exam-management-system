const { pool, query } = require("../db/pool");

const EXAM_STATUS = {
  PUBLISHED: "PUBLISHED",
  RESULTS_PUBLISHED: "RESULTS_PUBLISHED",
};

const SUBMISSION_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
};

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to backend/.env before using database features."
    );
  }
};

const runInTransaction = async (handler) => {
  requireDatabaseUrl();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const toNumberOrNull = (value) => {
  return value === null || value === undefined ? null : Number(value);
};

const toExamResponse = (exam) => ({
  id: exam.id,
  title: exam.title,
  description: exam.description,
  status: exam.status,
  durationMinutes: exam.duration_minutes,
  startsAt: exam.starts_at,
  endsAt: exam.ends_at,
  createdAt: exam.created_at,
  updatedAt: exam.updated_at,
  ...(Object.prototype.hasOwnProperty.call(exam, "is_available")
    ? { isAvailable: exam.is_available }
    : {}),
});

const toQuestionResponse = (question, options = []) => ({
  id: question.id,
  examId: question.exam_id,
  questionText: question.question_text,
  type: question.type,
  points: toNumberOrNull(question.points),
  position: question.position,
  createdAt: question.created_at,
  updatedAt: question.updated_at,
  options: options.map((option) => ({
    id: option.id,
    questionId: option.question_id,
    optionText: option.option_text,
    position: option.position,
    createdAt: option.created_at,
    updatedAt: option.updated_at,
  })),
});

const toSessionResponse = (session) => ({
  id: session.id,
  examId: session.exam_id,
  studentId: session.student_id,
  startedAt: session.started_at,
  expiresAt: session.expires_at,
  endedAt: session.ended_at,
  createdAt: session.created_at,
  updatedAt: session.updated_at,
});

const toSubmissionResponse = (submission) => ({
  id: submission.id,
  examId: submission.exam_id,
  studentId: submission.student_id,
  sessionId: submission.session_id,
  status: submission.status,
  submittedAt: submission.submitted_at,
  gradedAt: submission.graded_at,
  totalScore: toNumberOrNull(submission.total_score),
  feedback: submission.feedback,
  createdAt: submission.created_at,
  updatedAt: submission.updated_at,
});

const toSavedAnswerResponse = (answer) => ({
  id: answer.id,
  submissionId: answer.submission_id,
  questionId: answer.question_id,
  selectedOptionId: answer.selected_option_id,
  answerText: answer.answer_text,
  score: toNumberOrNull(answer.score),
  feedback: answer.feedback,
  createdAt: answer.created_at,
  updatedAt: answer.updated_at,
});

const getPublishedExam = async (queryFn, examId) => {
  const result = await queryFn(
    `SELECT id, title, description, status, duration_minutes,
            starts_at, ends_at, created_at, updated_at
     FROM exams
     WHERE id = $1`,
    [examId]
  );

  const exam = result.rows[0];

  if (!exam) {
    throw createError("Exam not found.", 404);
  }

  if (exam.status !== EXAM_STATUS.PUBLISHED) {
    throw createError("Only published exams are available to students.", 400);
  }

  return exam;
};

const getOwnedSubmission = async (queryFn, submissionId, studentId) => {
  const result = await queryFn(
    `SELECT id, exam_id, student_id, session_id, status, submitted_at,
            graded_at, total_score, feedback, created_at, updated_at
     FROM submissions
     WHERE id = $1 AND student_id = $2`,
    [submissionId, studentId]
  );

  const submission = result.rows[0];

  if (!submission) {
    throw createError("Submission not found.", 404);
  }

  return submission;
};

const getAvailableExams = async () => {
  const result = await query(
    `SELECT id, title, description, status, duration_minutes,
            starts_at, ends_at, created_at, updated_at,
            ((starts_at IS NULL OR starts_at <= NOW())
              AND (ends_at IS NULL OR ends_at >= NOW())) AS is_available
     FROM exams
     WHERE status = $1::exam_status
     ORDER BY is_available DESC, starts_at ASC NULLS FIRST, created_at DESC`,
    [EXAM_STATUS.PUBLISHED]
  );

  return result.rows.map(toExamResponse);
};

const startExam = async (examId, studentId, context = {}) => {
  return runInTransaction(async (client) => {
    const exam = await getPublishedExam(client.query.bind(client), examId);

    let sessionResult = await client.query(
      `SELECT id, exam_id, student_id, started_at, expires_at, ended_at,
              created_at, updated_at
       FROM exam_sessions
       WHERE exam_id = $1 AND student_id = $2`,
      [examId, studentId]
    );

    let session = sessionResult.rows[0];

    if (!session) {
      sessionResult = await client.query(
        `INSERT INTO exam_sessions (
           exam_id, student_id, expires_at, ip_address, user_agent
         )
         VALUES (
           $1, $2, COALESCE($3::timestamptz, NOW() + ($4 * INTERVAL '1 minute')), $5, $6
         )
         RETURNING id, exam_id, student_id, started_at, expires_at, ended_at,
                   created_at, updated_at`,
        [
          examId,
          studentId,
          exam.ends_at || null,
          exam.duration_minutes,
          context.ipAddress || null,
          context.userAgent || null,
        ]
      );
      session = sessionResult.rows[0];
    }

    let submissionResult = await client.query(
      `SELECT id, exam_id, student_id, session_id, status, submitted_at,
              graded_at, total_score, feedback, created_at, updated_at
       FROM submissions
       WHERE exam_id = $1 AND student_id = $2`,
      [examId, studentId]
    );

    let submission = submissionResult.rows[0];

    if (!submission) {
      submissionResult = await client.query(
        `INSERT INTO submissions (exam_id, student_id, session_id, status)
         VALUES ($1, $2, $3, $4::submission_status)
         RETURNING id, exam_id, student_id, session_id, status, submitted_at,
                   graded_at, total_score, feedback, created_at, updated_at`,
        [examId, studentId, session.id, SUBMISSION_STATUS.IN_PROGRESS]
      );
      submission = submissionResult.rows[0];
    }

    return {
      exam: toExamResponse(exam),
      session: toSessionResponse(session),
      submission: toSubmissionResponse(submission),
      submissionId: submission.id,
    };
  });
};

const getExamDetails = async (examId) => {
  const exam = await getPublishedExam(query, examId);

  const questionResult = await query(
    `SELECT id, exam_id, question_text, type, points, position,
            created_at, updated_at
     FROM questions
     WHERE exam_id = $1
     ORDER BY position ASC`,
    [examId]
  );

  const questions = questionResult.rows;

  if (questions.length === 0) {
    return {
      exam: toExamResponse(exam),
      questions: [],
    };
  }

  const questionIds = questions.map((question) => question.id);
  const optionResult = await query(
    `SELECT id, question_id, option_text, position, created_at, updated_at
     FROM question_options
     WHERE question_id = ANY($1::uuid[])
     ORDER BY position ASC`,
    [questionIds]
  );

  const optionsByQuestionId = new Map();

  for (const option of optionResult.rows) {
    const existingOptions = optionsByQuestionId.get(option.question_id) || [];
    existingOptions.push(option);
    optionsByQuestionId.set(option.question_id, existingOptions);
  }

  return {
    exam: toExamResponse(exam),
    questions: questions.map((question) =>
      toQuestionResponse(question, optionsByQuestionId.get(question.id) || [])
    ),
  };
};

const validateAnswerBelongsToSubmissionExam = async (client, submission, answer) => {
  const questionResult = await client.query(
    `SELECT id
     FROM questions
     WHERE id = $1 AND exam_id = $2`,
    [answer.questionId, submission.exam_id]
  );

  if (!questionResult.rows[0]) {
    throw createError("Answer contains a question that does not belong to this exam.", 400);
  }

  if (answer.selectedOptionId) {
    const optionResult = await client.query(
      `SELECT id
       FROM question_options
       WHERE id = $1 AND question_id = $2`,
      [answer.selectedOptionId, answer.questionId]
    );

    if (!optionResult.rows[0]) {
      throw createError("Answer contains an option that does not belong to its question.", 400);
    }
  }
};

const autoSaveAnswers = async (submissionId, studentId, answers) => {
  return runInTransaction(async (client) => {
    const submission = await getOwnedSubmission(client.query.bind(client), submissionId, studentId);

    if (submission.status !== SUBMISSION_STATUS.IN_PROGRESS) {
      throw createError("Only IN_PROGRESS submissions can be auto-saved.", 400);
    }

    const savedAnswers = [];

    for (const answer of answers) {
      await validateAnswerBelongsToSubmissionExam(client, submission, answer);

      const result = await client.query(
        `INSERT INTO answers (
           submission_id, question_id, selected_option_id, answer_text, score
         )
         VALUES ($1, $2, $3, $4, NULL)
         ON CONFLICT (submission_id, question_id)
         DO UPDATE SET
           selected_option_id = EXCLUDED.selected_option_id,
           answer_text = EXCLUDED.answer_text,
           score = NULL
         RETURNING id, submission_id, question_id, selected_option_id,
                   answer_text, score, feedback, created_at, updated_at`,
        [
          submissionId,
          answer.questionId,
          answer.selectedOptionId || null,
          answer.answerText || null,
        ]
      );

      savedAnswers.push(toSavedAnswerResponse(result.rows[0]));
    }

    return {
      submission: toSubmissionResponse(submission),
      answers: savedAnswers,
    };
  });
};

const submitExam = async (submissionId, studentId) => {
  return runInTransaction(async (client) => {
    const submission = await getOwnedSubmission(client.query.bind(client), submissionId, studentId);

    if (submission.status !== SUBMISSION_STATUS.IN_PROGRESS) {
      throw createError("Only IN_PROGRESS submissions can be submitted.", 400);
    }

    await client.query(
      `UPDATE answers AS a
       SET score = CASE
         WHEN qo.is_correct = TRUE THEN q.points
         ELSE 0
       END
       FROM questions AS q, question_options AS qo
       WHERE a.question_id = q.id
         AND a.selected_option_id = qo.id
         AND a.submission_id = $1
         AND q.type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE')`,
      [submissionId]
    );

    const submissionResult = await client.query(
      `UPDATE submissions
       SET status = $1::submission_status,
           submitted_at = NOW(),
           total_score = COALESCE(
             (SELECT SUM(score) FROM answers WHERE submission_id = $2 AND score IS NOT NULL),
             0
           )
       WHERE id = $2
       RETURNING id, exam_id, student_id, session_id, status, submitted_at,
                 graded_at, total_score, feedback, created_at, updated_at`,
      [SUBMISSION_STATUS.SUBMITTED, submissionId]
    );

    await client.query(
      `UPDATE exam_sessions
       SET ended_at = COALESCE(ended_at, NOW())
       WHERE id = $1`,
      [submission.session_id]
    );

    return toSubmissionResponse(submissionResult.rows[0]);
  });
};

const getMySubmissions = async (studentId) => {
  const result = await query(
    `SELECT s.id, s.exam_id, s.student_id, s.session_id, s.status,
            s.submitted_at, s.graded_at, s.total_score, s.feedback,
            s.created_at, s.updated_at,
            e.title AS exam_title, e.status AS exam_status,
            e.duration_minutes, e.starts_at, e.ends_at
     FROM submissions s
     INNER JOIN exams e ON e.id = s.exam_id
     WHERE s.student_id = $1
     ORDER BY s.created_at DESC`,
    [studentId]
  );

  return result.rows.map((row) => ({
    ...toSubmissionResponse(row),
    exam: {
      id: row.exam_id,
      title: row.exam_title,
      status: row.exam_status,
      durationMinutes: row.duration_minutes,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
    },
  }));
};

const getSubmissionResult = async (submissionId, studentId) => {
  const submissionResult = await query(
    `SELECT s.id, s.exam_id, s.student_id, s.session_id, s.status,
            s.submitted_at, s.graded_at, s.total_score, s.feedback,
            s.created_at, s.updated_at,
            e.title AS exam_title, e.status AS exam_status,
            e.duration_minutes, e.starts_at, e.ends_at
     FROM submissions s
     INNER JOIN exams e ON e.id = s.exam_id
     WHERE s.id = $1 AND s.student_id = $2`,
    [submissionId, studentId]
  );

  const submission = submissionResult.rows[0];

  if (!submission) {
    throw createError("Submission not found.", 404);
  }

  if (submission.exam_status !== EXAM_STATUS.RESULTS_PUBLISHED) {
    throw createError("Results are not published for this exam yet.", 403);
  }

  const answerResult = await query(
    `SELECT a.id, a.submission_id, a.question_id, a.selected_option_id,
            a.answer_text, a.score, a.feedback, a.created_at, a.updated_at,
            q.question_text, q.type, q.points, q.position,
            qo.option_text AS selected_option_text
     FROM answers a
     INNER JOIN questions q ON q.id = a.question_id
     LEFT JOIN question_options qo ON qo.id = a.selected_option_id
     WHERE a.submission_id = $1
     ORDER BY q.position ASC`,
    [submissionId]
  );

  return {
    submission: {
      ...toSubmissionResponse(submission),
      exam: {
        id: submission.exam_id,
        title: submission.exam_title,
        status: submission.exam_status,
        durationMinutes: submission.duration_minutes,
        startsAt: submission.starts_at,
        endsAt: submission.ends_at,
      },
    },
    answers: answerResult.rows.map((answer) => ({
      id: answer.id,
      questionId: answer.question_id,
      questionText: answer.question_text,
      type: answer.type,
      points: toNumberOrNull(answer.points),
      position: answer.position,
      selectedOptionId: answer.selected_option_id,
      selectedOptionText: answer.selected_option_text,
      answerText: answer.answer_text,
      score: toNumberOrNull(answer.score),
      feedback: answer.feedback,
    })),
  };
};

module.exports = {
  getAvailableExams,
  startExam,
  getExamDetails,
  autoSaveAnswers,
  submitExam,
  getMySubmissions,
  getSubmissionResult,
};
