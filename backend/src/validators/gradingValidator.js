const Joi = require("joi");

const answerGradeSchema = Joi.object({
  score: Joi.number().min(0).required(),
  feedback: Joi.string().allow("", null).optional(),
});

const submissionGradeSchema = Joi.object({
  feedback: Joi.string().allow("", null).optional(),
});

const uuidSchema = Joi.string().uuid().required();

const formatValidationError = (error) => {
  return error.details.map((detail) => detail.message).join("; ");
};

const validateAnswerGradePayload = (payload) => {
  const { value, error } = answerGradeSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationError = new Error(formatValidationError(error));
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
};

const validateSubmissionGradePayload = (payload) => {
  const { value, error } = submissionGradeSchema.validate(payload || {}, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationError = new Error(formatValidationError(error));
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
};

const validateUuid = (id, fieldName) => {
  const { value, error } = uuidSchema.validate(id);

  if (error) {
    const validationError = new Error(`Invalid ${fieldName}.`);
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
};

module.exports = {
  validateAnswerGradePayload,
  validateSubmissionGradePayload,
  validateUuid,
};
