const express = require("express");

const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const examQuestionRoutes = express.Router({ mergeParams: true });
const questionRoutes = express.Router();

const lecturerOrAdmin = [authMiddleware, roleMiddleware("LECTURER", "ADMIN")];

examQuestionRoutes.use(lecturerOrAdmin);
questionRoutes.use(lecturerOrAdmin);

examQuestionRoutes.post("/", questionController.createQuestion);
examQuestionRoutes.get("/", questionController.getQuestionsByExam);

questionRoutes.put("/:id", questionController.updateQuestion);
questionRoutes.delete("/:id", questionController.deleteQuestion);

module.exports = {
  examQuestionRoutes,
  questionRoutes,
};
