const express = require("express");

const { getApiStatus } = require("../controllers/apiController");

const router = express.Router();

router.get("/", getApiStatus);

module.exports = router;
