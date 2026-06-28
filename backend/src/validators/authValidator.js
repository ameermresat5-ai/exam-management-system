const Joi = require("joi");

const allowedRoles = ["ADMIN", "LECTURER", "STUDENT"];

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().max(255).required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string()
    .valid(...allowedRoles)
    .default("STUDENT"),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(255).required(),
  password: Joi.string().required(),
});

const validateRequest = (schema, payload) => {
  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationError = new Error(
      error.details.map((detail) => detail.message).join("; ")
    );
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
};

module.exports = {
  allowedRoles,
  registerSchema,
  loginSchema,
  validateRequest,
};
