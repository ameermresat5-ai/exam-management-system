const express = require("express");

const gradingController = require("../controllers/gradingController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const examSubmissionRoutes = express.Router({ mergeParams: true });
const gradingSubmissionRoutes = express.Router();
const answerGradingRoutes = express.Router();

const lecturerOrAdmin = [authMiddleware, roleMiddleware("LECTURER", "ADMIN")];

examSubmissionRoutes.get(
  "/",
  lecturerOrAdmin,
  gradingController.getExamSubmissions
);

gradingSubmissionRoutes.get(
  "/:id",
  lecturerOrAdmin,
  gradingController.getSubmissionForGrading
);
gradingSubmissionRoutes.patch(
  "/:id/grade",
  lecturerOrAdmin,
  gradingController.gradeSubmission
);

answerGradingRoutes.patch(
  "/:answerId/grade",
  lecturerOrAdmin,
  gradingController.gradeAnswer
);

module.exports = {
  examSubmissionRoutes,
  gradingSubmissionRoutes,
  answerGradingRoutes,
};
