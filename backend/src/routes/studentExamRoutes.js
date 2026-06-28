const express = require("express");

const studentExamController = require("../controllers/studentExamController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const studentRoutes = express.Router();
const submissionRoutes = express.Router();

const studentOnly = [authMiddleware, roleMiddleware("STUDENT")];

studentRoutes.use(studentOnly);
submissionRoutes.use(studentOnly);

studentRoutes.get("/exams/available", studentExamController.getAvailableExams);
studentRoutes.post("/exams/:examId/start", studentExamController.startExam);
studentRoutes.get("/exams/:examId", studentExamController.getExamDetails);

submissionRoutes.get("/my", studentExamController.getMySubmissions);
submissionRoutes.patch(
  "/:submissionId/auto-save",
  studentExamController.autoSaveAnswers
);
submissionRoutes.post("/:submissionId/submit", studentExamController.submitExam);
submissionRoutes.get("/:id/result", studentExamController.getSubmissionResult);

module.exports = {
  studentRoutes,
  submissionRoutes,
};
