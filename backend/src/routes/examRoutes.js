const express = require("express");

const examController = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("LECTURER", "ADMIN"));

router.post("/", examController.createExam);
router.get("/my", examController.getMyExams);
router.get("/:id", examController.getExamById);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);
router.patch("/:id/publish", examController.publishExam);
router.patch("/:id/close", examController.closeExam);
router.patch("/:id/publish-results", examController.publishResults);

module.exports = router;
