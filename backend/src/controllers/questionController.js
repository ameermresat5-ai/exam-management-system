const questionService = require("../services/questionService");
const {
  validateQuestionPayload,
  validateUuid,
} = require("../validators/questionValidator");

const createQuestion = async (req, res, next) => {
  try {
    const examId = validateUuid(req.params.examId, "exam id");
    const payload = validateQuestionPayload(req.body, {
      requireOptionsForChoice: true,
    });
    const question = await questionService.createQuestion(examId, payload, req.user);

    res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

const getQuestionsByExam = async (req, res, next) => {
  try {
    const examId = validateUuid(req.params.examId, "exam id");
    const questions = await questionService.getQuestionsByExam(examId, req.user);

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully.",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const questionId = validateUuid(req.params.id, "question id");
    const payload = validateQuestionPayload(req.body);
    const question = await questionService.updateQuestion(questionId, payload, req.user);

    res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const questionId = validateUuid(req.params.id, "question id");
    const question = await questionService.deleteQuestion(questionId, req.user);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
};
