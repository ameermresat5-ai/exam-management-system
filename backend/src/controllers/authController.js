const authService = require("../services/authService");
const {
  registerSchema,
  loginSchema,
  validateRequest,
} = require("../validators/authValidator");

const register = async (req, res, next) => {
  try {
    const payload = validateRequest(registerSchema, req.body);
    const result = await authService.register(payload);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = validateRequest(loginSchema, req.body);
    const result = await authService.login(payload);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
