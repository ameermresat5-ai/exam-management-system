const { query } = require("../db/pool");

const EXAM_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
  RESULTS_PUBLISHED: "RESULTS_PUBLISHED",
};

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toExamResponse = (exam) => ({
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
});

const canManageExam = (user, exam) => {
  return user.role === "ADMIN" || exam.lecturer_id === user.id;
};

const getExamRowById = async (examId) => {
  const result = await query(
    `SELECT id, lecturer_id, title, description, status, duration_minutes,
            starts_at, ends_at, created_at, updated_at
     FROM exams
     WHERE id = $1`,
    [examId]
  );

  return result.rows[0] || null;
};

const getExamForUser = async (examId, user) => {
  const exam = await getExamRowById(examId);

  if (!exam) {
    throw createError("Exam not found.", 404);
  }

  if (!canManageExam(user, exam)) {
    throw createError("You do not have permission to access this exam.", 403);
  }

  return exam;
};

const createExam = async (payload, user) => {
  const result = await query(
    `INSERT INTO exams (
       lecturer_id, title, description, status, duration_minutes, starts_at, ends_at
     )
     VALUES ($1, $2, $3, $4::exam_status, $5, $6, $7)
     RETURNING id, lecturer_id, title, description, status, duration_minutes,
               starts_at, ends_at, created_at, updated_at`,
    [
      user.id,
      payload.title,
      payload.description || null,
      EXAM_STATUS.DRAFT,
      payload.durationMinutes,
      payload.startsAt || null,
      payload.endsAt || null,
    ]
  );

  return toExamResponse(result.rows[0]);
};

const getMyExams = async (user) => {
  const result = await query(
    `SELECT id, lecturer_id, title, description, status, duration_minutes,
            starts_at, ends_at, created_at, updated_at
     FROM exams
     WHERE lecturer_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  return result.rows.map(toExamResponse);
};

const getExamById = async (examId, user) => {
  const exam = await getExamForUser(examId, user);
  return toExamResponse(exam);
};

const updateExam = async (examId, payload, user) => {
  const exam = await getExamForUser(examId, user);

  if (exam.status !== EXAM_STATUS.DRAFT) {
    throw createError("Only DRAFT exams can be edited.", 400);
  }

  const result = await query(
    `UPDATE exams
     SET title = $1,
         description = $2,
         duration_minutes = $3,
         starts_at = $4,
         ends_at = $5
     WHERE id = $6
     RETURNING id, lecturer_id, title, description, status, duration_minutes,
               starts_at, ends_at, created_at, updated_at`,
    [
      payload.title,
      payload.description || null,
      payload.durationMinutes,
      payload.startsAt || null,
      payload.endsAt || null,
      examId,
    ]
  );

  return toExamResponse(result.rows[0]);
};

const deleteExam = async (examId, user) => {
  const exam = await getExamForUser(examId, user);

  if (exam.status !== EXAM_STATUS.DRAFT) {
    throw createError("Only DRAFT exams can be deleted.", 400);
  }

  await query("DELETE FROM exams WHERE id = $1", [examId]);

  return toExamResponse(exam);
};

const updateExamStatus = async (examId, status, user) => {
  const exam = await getExamForUser(examId, user);

  const result = await query(
    `UPDATE exams
     SET status = $1::exam_status
     WHERE id = $2
     RETURNING id, lecturer_id, title, description, status, duration_minutes,
               starts_at, ends_at, created_at, updated_at`,
    [status, exam.id]
  );

  return toExamResponse(result.rows[0]);
};

module.exports = {
  EXAM_STATUS,
  createExam,
  getMyExams,
  getExamById,
  updateExam,
  deleteExam,
  updateExamStatus,
};
