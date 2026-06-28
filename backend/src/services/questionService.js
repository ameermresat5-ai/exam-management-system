const { pool, query } = require("../db/pool");

const DRAFT_STATUS = "DRAFT";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const runInTransaction = async (handler) => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to backend/.env before using database features."
    );
  }

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

const translateDatabaseError = (error) => {
  if (error.statusCode) {
    throw error;
  }

  if (error.code === "23505") {
    if (error.constraint === "questions_exam_id_position_key") {
      throw createError("Question position already exists for this exam.", 409);
    }

    if (error.constraint === "question_options_question_id_position_key") {
      throw createError("Option position already exists for this question.", 409);
    }
  }

  throw error;
};

const toOptionResponse = (option) => ({
  id: option.id,
  questionId: option.question_id,
  optionText: option.option_text,
  isCorrect: option.is_correct,
  position: option.position,
  createdAt: option.created_at,
  updatedAt: option.updated_at,
});

const toQuestionResponse = (question, options = []) => ({
  id: question.id,
  examId: question.exam_id,
  questionText: question.question_text,
  type: question.type,
  points: question.points,
  position: question.position,
  correctAnswer: question.correct_answer,
  createdAt: question.created_at,
  updatedAt: question.updated_at,
  options: options.map(toOptionResponse),
});

const canManageExam = (user, exam) => {
  return user.role === "ADMIN" || exam.lecturer_id === user.id;
};

const ensureExamAccess = async (queryFn, examId, user) => {
  const result = await queryFn(
    `SELECT id, lecturer_id, status
     FROM exams
     WHERE id = $1`,
    [examId]
  );

  const exam = result.rows[0];

  if (!exam) {
    throw createError("Exam not found.", 404);
  }

  if (!canManageExam(user, exam)) {
    throw createError("You do not have permission to access this exam.", 403);
  }

  return exam;
};

const ensureDraftExam = (exam) => {
  if (exam.status !== DRAFT_STATUS) {
    throw createError("Questions can only be changed while the exam is in DRAFT status.", 400);
  }
};

const getQuestionWithExam = async (queryFn, questionId, user) => {
  const result = await queryFn(
    `SELECT q.id, q.exam_id, q.question_text, q.type, q.points, q.position,
            q.correct_answer, q.created_at, q.updated_at,
            e.lecturer_id, e.status AS exam_status
     FROM questions q
     INNER JOIN exams e ON e.id = q.exam_id
     WHERE q.id = $1`,
    [questionId]
  );

  const question = result.rows[0];

  if (!question) {
    throw createError("Question not found.", 404);
  }

  if (user.role !== "ADMIN" && question.lecturer_id !== user.id) {
    throw createError("You do not have permission to access this question.", 403);
  }

  return question;
};

const getOptionsByQuestionId = async (queryFn, questionId) => {
  const result = await queryFn(
    `SELECT id, question_id, option_text, is_correct, position, created_at, updated_at
     FROM question_options
     WHERE question_id = $1
     ORDER BY position ASC`,
    [questionId]
  );

  return result.rows;
};

const insertOptions = async (queryFn, questionId, options = []) => {
  const createdOptions = [];

  for (const option of options) {
    const result = await queryFn(
      `INSERT INTO question_options (question_id, option_text, is_correct, position)
       VALUES ($1, $2, $3, $4)
       RETURNING id, question_id, option_text, is_correct, position, created_at, updated_at`,
      [questionId, option.optionText, option.isCorrect, option.position]
    );

    createdOptions.push(result.rows[0]);
  }

  return createdOptions;
};

const createQuestion = async (examId, payload, user) => {
  return runInTransaction(async (client) => {
    const exam = await ensureExamAccess(client.query.bind(client), examId, user);
    ensureDraftExam(exam);

    const questionResult = await client.query(
      `INSERT INTO questions (
         exam_id, question_text, type, points, position, correct_answer
       )
       VALUES ($1, $2, $3::question_type, $4, $5, $6)
       RETURNING id, exam_id, question_text, type, points, position,
                 correct_answer, created_at, updated_at`,
      [
        examId,
        payload.questionText,
        payload.type,
        payload.points,
        payload.position,
        payload.correctAnswer || null,
      ]
    );

    const question = questionResult.rows[0];
    const options = await insertOptions(client.query.bind(client), question.id, payload.options || []);

    return toQuestionResponse(question, options);
  }).catch(translateDatabaseError);
};

const getQuestionsByExam = async (examId, user) => {
  const exam = await ensureExamAccess(query, examId, user);

  const questionResult = await query(
    `SELECT id, exam_id, question_text, type, points, position,
            correct_answer, created_at, updated_at
     FROM questions
     WHERE exam_id = $1
     ORDER BY position ASC`,
    [exam.id]
  );

  const questions = questionResult.rows;

  if (questions.length === 0) {
    return [];
  }

  const questionIds = questions.map((question) => question.id);
  const optionResult = await query(
    `SELECT id, question_id, option_text, is_correct, position, created_at, updated_at
     FROM question_options
     WHERE question_id = ANY($1::uuid[])
     ORDER BY position ASC`,
    [questionIds]
  );

  const optionsByQuestionId = new Map();

  for (const option of optionResult.rows) {
    const currentOptions = optionsByQuestionId.get(option.question_id) || [];
    currentOptions.push(option);
    optionsByQuestionId.set(option.question_id, currentOptions);
  }

  return questions.map((question) =>
    toQuestionResponse(question, optionsByQuestionId.get(question.id) || [])
  );
};

const updateQuestion = async (questionId, payload, user) => {
  return runInTransaction(async (client) => {
    const questionWithExam = await getQuestionWithExam(
      client.query.bind(client),
      questionId,
      user
    );

    ensureDraftExam({ status: questionWithExam.exam_status });

    const questionResult = await client.query(
      `UPDATE questions
       SET question_text = $1,
           type = $2::question_type,
           points = $3,
           position = $4,
           correct_answer = $5
       WHERE id = $6
       RETURNING id, exam_id, question_text, type, points, position,
                 correct_answer, created_at, updated_at`,
      [
        payload.questionText,
        payload.type,
        payload.points,
        payload.position,
        payload.correctAnswer || null,
        questionId,
      ]
    );

    let options;

    if (Object.prototype.hasOwnProperty.call(payload, "options")) {
      await client.query("DELETE FROM question_options WHERE question_id = $1", [questionId]);
      options = await insertOptions(client.query.bind(client), questionId, payload.options || []);
    } else {
      options = await getOptionsByQuestionId(client.query.bind(client), questionId);
    }

    return toQuestionResponse(questionResult.rows[0], options);
  }).catch(translateDatabaseError);
};

const deleteQuestion = async (questionId, user) => {
  return runInTransaction(async (client) => {
    const question = await getQuestionWithExam(client.query.bind(client), questionId, user);
    ensureDraftExam({ status: question.exam_status });

    const options = await getOptionsByQuestionId(client.query.bind(client), questionId);

    await client.query("DELETE FROM questions WHERE id = $1", [questionId]);

    return toQuestionResponse(question, options);
  }).catch(translateDatabaseError);
};

module.exports = {
  createQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
};
