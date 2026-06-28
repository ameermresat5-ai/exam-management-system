const examService = require("../services/examService");
const {
  validateExamPayload,
  validateExamId,
} = require("../validators/examValidator");

const createExam = async (req, res, next) => {
  try {
    const payload = validateExamPayload(req.body);
    const exam = await examService.createExam(payload, req.user);

    res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const getMyExams = async (req, res, next) => {
  try {
    const exams = await examService.getMyExams(req.user);

    res.status(200).json({
      success: true,
      message: "Exams retrieved successfully.",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

const getExamById = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const exam = await examService.getExamById(examId, req.user);

    res.status(200).json({
      success: true,
      message: "Exam retrieved successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const payload = validateExamPayload(req.body);
    const exam = await examService.updateExam(examId, payload, req.user);

    res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const exam = await examService.deleteExam(examId, req.user);

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const publishExam = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const exam = await examService.updateExamStatus(
      examId,
      examService.EXAM_STATUS.PUBLISHED,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Exam published successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const closeExam = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const exam = await examService.updateExamStatus(
      examId,
      examService.EXAM_STATUS.CLOSED,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Exam closed successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

const publishResults = async (req, res, next) => {
  try {
    const examId = validateExamId(req.params.id);
    const exam = await examService.updateExamStatus(
      examId,
      examService.EXAM_STATUS.RESULTS_PUBLISHED,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Exam results published successfully.",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getMyExams,
  getExamById,
  updateExam,
  deleteExam,
  publishExam,
  closeExam,
  publishResults,
};
