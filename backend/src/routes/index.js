const express = require("express");

const { getApiStatus, checkDatabase } = require("../controllers/apiController");
const authRoutes = require("./authRoutes");
const examRoutes = require("./examRoutes");
const { examQuestionRoutes, questionRoutes } = require("./questionRoutes");
const { studentRoutes, submissionRoutes } = require("./studentExamRoutes");
const {
  examSubmissionRoutes,
  gradingSubmissionRoutes,
  answerGradingRoutes,
} = require("./gradingRoutes");

const router = express.Router();

router.get("/", getApiStatus);
router.get("/db-check", checkDatabase);
router.use("/auth", authRoutes);
router.use("/student", studentRoutes);
router.use("/submissions", submissionRoutes);
router.use("/submissions", gradingSubmissionRoutes);
router.use("/answers", answerGradingRoutes);
router.use("/exams/:examId/questions", examQuestionRoutes);
router.use("/exams/:examId/submissions", examSubmissionRoutes);
router.use("/exams", examRoutes);
router.use("/questions", questionRoutes);

module.exports = router;
