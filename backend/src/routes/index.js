const express = require("express");

const { getApiStatus, checkDatabase } = require("../controllers/apiController");

const router = express.Router();

router.get("/", getApiStatus);
router.get("/db-check", checkDatabase);

module.exports = router;
