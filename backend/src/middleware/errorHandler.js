const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && isProduction
        ? "Internal server error"
        : err.message || "Internal server error",
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
