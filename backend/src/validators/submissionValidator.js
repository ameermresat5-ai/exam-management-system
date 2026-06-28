const Joi = require("joi");

const answerSchema = Joi.object({
  questionId: Joi.string().uuid().required(),
  selectedOptionId: Joi.string().uuid().allow(null).optional(),
  answerText: Joi.string().allow("", null).optional(),
});

const autoSaveSchema = Joi.object({
  answers: Joi.array().items(answerSchema).min(1).required(),
});

const uuidSchema = Joi.string().uuid().required();

const formatValidationError = (error) => {
  return error.details.map((detail) => detail.message).join("; ");
};

const validateAutoSavePayload = (payload) => {
  const { value, error } = autoSaveSchema.validate(payload, {
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
  validateAutoSavePayload,
  validateUuid,
};
