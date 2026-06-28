const { query } = require("../db/pool");

const getApiStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Exam Management API is running.",
  });
};

const checkDatabase = async (req, res, next) => {
  try {
    const result = await query("SELECT NOW() AS now");

    res.status(200).json({
      success: true,
      database: {
        status: "connected",
        time: result.rows[0].now,
      },
    });
  } catch (error) {
    const dbError = new Error(`Database check failed: ${error.message}`);
    dbError.statusCode = 503;
    next(dbError);
  }
};

module.exports = {
  getApiStatus,
  checkDatabase,
};
