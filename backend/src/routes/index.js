const express = require("express");

const { getApiStatus, checkDatabase } = require("../controllers/apiController");
const authRoutes = require("./authRoutes");
const examRoutes = require("./examRoutes");

const router = express.Router();

router.get("/", getApiStatus);
router.get("/db-check", checkDatabase);
router.use("/auth", authRoutes);
router.use("/exams", examRoutes);

module.exports = router;
