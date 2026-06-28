const { query } = require("../db/pool");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toNumberOrNull = (value) => {
  return value === null || value === undefined ? null : Number(value);
};

const canGradeExam = (user, exam) => {
  return user.role === "ADMIN" || exam.lecturer_id === user.id;
};

const toStudentResponse = (row) => ({
  id: row.student_id || row.user_id,
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  isActive: row.is_active,
});

const toExamResponse = (row) => ({
  id: row.exam_id,
  lecturerId: row.lecturer_id,
  title: row.exam_title,
  description: row.exam_description,
  status: row.exam_status,
  durationMinutes: row.duration_minutes,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
});

const toSubmissionResponse = (row) => ({
  id: row.id,
  examId: row.exam_id,
  studentId: row.student_id,
  sessionId: row.session_id,
  status: row.status,
  submittedAt: row.submitted_at,
  gradedAt: row.graded_at,
  gradedBy: row.graded_by,
  totalScore: toNumberOrNull(row.total_score),
  feedback: row.feedback,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toOptionResponse = (option) => ({
  id: option.id,
  questionId: option.question_id,
  optionText: option.option_text,
  isCorrect: option.is_correct,
  position: option.position,
  createdAt: option.created_at,
  updatedAt: option.updated_at,
});

const ensureExamAccess = async (examId, user) => {
  const result = await query(
    `SELECT id, lecturer_id, title, description, status, duration_minutes,
            starts_at, ends_at, created_at, updated_at
     FROM exams
     WHERE id = $1`,
    [examId]
  );

  const exam = result.rows[0];

  if (!exam) {
    throw createError("Exam not found.", 404);
  }

  if (!canGradeExam(user, exam)) {
    throw createError("You do not have permission to grade this exam.", 403);
  }

  return exam;
};

const getSubmissionAccessRow = async (submissionId, user) => {
  const result = await query(
    `SELECT s.id, s.exam_id, s.student_id, s.session_id, s.status,
            s.submitted_at, s.graded_at, s.graded_by, s.total_score,
            s.feedback, s.created_at, s.updated_at,
            e.lecturer_id, e.title AS exam_title,
            e.description AS exam_description, e.status AS exam_status,
            e.duration_minutes, e.starts_at, e.ends_at,
            u.full_name, u.email, u.role, u.is_active
     FROM submissions s
     INNER JOIN exams e ON e.id = s.exam_id
     INNER JOIN users u ON u.id = s.student_id
     WHERE s.id = $1`,
    [submissionId]
  );

  const submission = result.rows[0];

  if (!submission) {
    throw createError("Submission not found.", 404);
  }

  if (!canGradeExam(user, submission)) {
    throw createError("You do not have permission to grade this submission.", 403);
  }

  return submission;
};

const getExamSubmissions = async (examId, user) => {
  const exam = await ensureExamAccess(examId, user);

  const result = await query(
    `SELECT s.id, s.exam_id, s.student_id, s.session_id, s.status,
            s.submitted_at, s.graded_at, s.graded_by, s.total_score,
            s.feedback, s.created_at, s.updated_at,
            u.id AS user_id, u.full_name, u.email, u.role, u.is_active
     FROM submissions s
     INNER JOIN users u ON u.id = s.student_id
     WHERE s.exam_id = $1
     ORDER BY s.submitted_at DESC NULLS LAST, s.created_at DESC`,
    [exam.id]
  );

  return {
    exam: {
      id: exam.id,
      lecturerId: exam.lecturer_id,
      title: exam.title,
      description: exam.description,
      status: exam.status,
      durationMinutes: exam.duration_minutes,
      startsAt: exam.starts_at,
      endsAt: exam.ends_at,
      createdAt: exam.created_at,
      updatedAt: exam.updated_at,
    },
    submissions: result.rows.map((row) => ({
      ...toSubmissionResponse(row),
      student: toStudentResponse(row),
    })),
  };
};

const getSubmissionForGrading = async (submissionId, user) => {
  const submission = await getSubmissionAccessRow(submissionId, user);

  const answerResult = await query(
    `SELECT a.id, a.submission_id, a.question_id, a.selected_option_id,
            a.answer_text, a.score, a.feedback, a.created_at, a.updated_at,
            q.question_text, q.type, q.points, q.position, q.correct_answer,
            q.created_at AS question_created_at,
            q.updated_at AS question_updated_at
     FROM answers a
     INNER JOIN questions q ON q.id = a.question_id
     WHERE a.submission_id = $1
     ORDER BY q.position ASC`,
    [submissionId]
  );

  const questionIds = answerResult.rows.map((answer) => answer.question_id);
  let optionsByQuestionId = new Map();

  if (questionIds.length > 0) {
    const optionResult = await query(
      `SELECT id, question_id, option_text, is_correct, position,
              created_at, updated_at
       FROM question_options
       WHERE question_id = ANY($1::uuid[])
       ORDER BY position ASC`,
      [questionIds]
    );

    for (const option of optionResult.rows) {
      const currentOptions = optionsByQuestionId.get(option.question_id) || [];
      currentOptions.push(option);
      optionsByQuestionId.set(option.question_id, currentOptions);
    }
  }

  return {
    submission: toSubmissionResponse(submission),
    student: toStudentResponse(submission),
    exam: toExamResponse(submission),
    answers: answerResult.rows.map((answer) => ({
      id: answer.id,
      submissionId: answer.submission_id,
      selectedOptionId: answer.selected_option_id,
      answerText: answer.answer_text,
      score: toNumberOrNull(answer.score),
      feedback: answer.feedback,
      createdAt: answer.created_at,
      updatedAt: answer.updated_at,
      question: {
        id: answer.question_id,
        questionText: answer.question_text,
        type: answer.type,
        points: toNumberOrNull(answer.points),
        position: answer.position,
        correctAnswer: answer.correct_answer,
        createdAt: answer.question_created_at,
        updatedAt: answer.question_updated_at,
        options: (optionsByQuestionId.get(answer.question_id) || []).map(toOptionResponse),
      },
    })),
  };
};

const getAnswerAccessRow = async (answerId, user) => {
  const result = await query(
    `SELECT a.id, a.submission_id, a.question_id, a.selected_option_id,
            a.answer_text, a.score, a.feedback, a.created_at, a.updated_at,
            q.points, q.type, e.lecturer_id, s.exam_id
     FROM answers a
     INNER JOIN questions q ON q.id = a.question_id
     INNER JOIN submissions s ON s.id = a.submission_id
     INNER JOIN exams e ON e.id = s.exam_id
     WHERE a.id = $1`,
    [answerId]
  );

  const answer = result.rows[0];

  if (!answer) {
    throw createError("Answer not found.", 404);
  }

  if (!canGradeExam(user, answer)) {
    throw createError("You do not have permission to grade this answer.", 403);
  }

  return answer;
};

const gradeAnswer = async (answerId, payload, user) => {
  const answer = await getAnswerAccessRow(answerId, user);
  const questionPoints = Number(answer.points);

  if (payload.score > questionPoints) {
    throw createError("Score cannot be greater than question points.", 400);
  }

  const nextFeedback = Object.prototype.hasOwnProperty.call(payload, "feedback")
    ? payload.feedback || null
    : answer.feedback;

  const result = await query(
    `UPDATE answers
     SET score = $1,
         feedback = $2
     WHERE id = $3
     RETURNING id, submission_id, question_id, selected_option_id,
               answer_text, score, feedback, created_at, updated_at`,
    [payload.score, nextFeedback, answerId]
  );

  return {
    id: result.rows[0].id,
    submissionId: result.rows[0].submission_id,
    questionId: result.rows[0].question_id,
    selectedOptionId: result.rows[0].selected_option_id,
    answerText: result.rows[0].answer_text,
    score: toNumberOrNull(result.rows[0].score),
    feedback: result.rows[0].feedback,
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  };
};

const gradeSubmission = async (submissionId, payload, user) => {
  const submission = await getSubmissionAccessRow(submissionId, user);
  const nextFeedback = Object.prototype.hasOwnProperty.call(payload, "feedback")
    ? payload.feedback || null
    : submission.feedback;

  const result = await query(
    `UPDATE submissions
     SET status = 'GRADED'::submission_status,
         graded_at = NOW(),
         graded_by = $1,
         feedback = $2,
         total_score = COALESCE(
           (SELECT SUM(score) FROM answers WHERE submission_id = $3 AND score IS NOT NULL),
           0
         )
     WHERE id = $3
     RETURNING id, exam_id, student_id, session_id, status, submitted_at,
               graded_at, graded_by, total_score, feedback, created_at, updated_at`,
    [user.id, nextFeedback, submissionId]
  );

  return toSubmissionResponse(result.rows[0]);
};

module.exports = {
  getExamSubmissions,
  getSubmissionForGrading,
  gradeAnswer,
  gradeSubmission,
};
