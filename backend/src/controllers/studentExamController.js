const studentExamService = require("../services/studentExamService");
const {
  validateAutoSavePayload,
  validateUuid,
} = require("../validators/submissionValidator");

const getAvailableExams = async (req, res, next) => {
  try {
    const exams = await studentExamService.getAvailableExams();

    res.status(200).json({
      success: true,
      message: "Available exams retrieved successfully.",
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

const startExam = async (req, res, next) => {
  try {
    const examId = validateUuid(req.params.examId, "exam id");
    const result = await studentExamService.startExam(examId, req.user.id, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(200).json({
      success: true,
      message: "Exam started successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getExamDetails = async (req, res, next) => {
  try {
    const examId = validateUuid(req.params.examId, "exam id");
    const result = await studentExamService.getExamDetails(examId);

    res.status(200).json({
      success: true,
      message: "Exam retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const autoSaveAnswers = async (req, res, next) => {
  try {
    const submissionId = validateUuid(req.params.submissionId, "submission id");
    const payload = validateAutoSavePayload(req.body);
    const result = await studentExamService.autoSaveAnswers(
      submissionId,
      req.user.id,
      payload.answers
    );

    res.status(200).json({
      success: true,
      message: "Answers auto-saved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const submitExam = async (req, res, next) => {
  try {
    const submissionId = validateUuid(req.params.submissionId, "submission id");
    const result = await studentExamService.submitExam(submissionId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await studentExamService.getMySubmissions(req.user.id);

    res.status(200).json({
      success: true,
      message: "Submissions retrieved successfully.",
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionResult = async (req, res, next) => {
  try {
    const submissionId = validateUuid(req.params.id, "submission id");
    const result = await studentExamService.getSubmissionResult(submissionId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Submission result retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
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
