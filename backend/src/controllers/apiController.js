const getApiStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Exam Management API is running.",
  });
};

module.exports = {
  getApiStatus,
};
