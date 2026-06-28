const gradingService = require("../services/gradingService");
const {
  validateAnswerGradePayload,
  validateSubmissionGradePayload,
  validateUuid,
} = require("../validators/gradingValidator");

const getExamSubmissions = async (req, res, next) => {
  try {
    const examId = validateUuid(req.params.examId, "exam id");
    const data = await gradingService.getExamSubmissions(examId, req.user);

    res.status(200).json({
      success: true,
      message: "Exam submissions retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionForGrading = async (req, res, next) => {
  try {
    const submissionId = validateUuid(req.params.id, "submission id");
    const data = await gradingService.getSubmissionForGrading(submissionId, req.user);

    res.status(200).json({
      success: true,
      message: "Submission retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const gradeAnswer = async (req, res, next) => {
  try {
    const answerId = validateUuid(req.params.answerId, "answer id");
    const payload = validateAnswerGradePayload(req.body);
    const data = await gradingService.gradeAnswer(answerId, payload, req.user);

    res.status(200).json({
      success: true,
      message: "Answer graded successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const gradeSubmission = async (req, res, next) => {
  try {
    const submissionId = validateUuid(req.params.id, "submission id");
    const payload = validateSubmissionGradePayload(req.body);
    const data = await gradingService.gradeSubmission(submissionId, payload, req.user);

    res.status(200).json({
      success: true,
      message: "Submission graded successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExamSubmissions,
  getSubmissionForGrading,
  gradeAnswer,
  gradeSubmission,
};
