const Joi = require("joi");

const QUESTION_TYPES = [
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
  "ESSAY",
  "CODE",
];

const optionSchema = Joi.object({
  optionText: Joi.string().trim().min(1).required(),
  isCorrect: Joi.boolean().required(),
  position: Joi.number().integer().positive().required(),
});

const questionPayloadSchema = Joi.object({
  questionText: Joi.string().trim().min(1).required(),
  type: Joi.string()
    .valid(...QUESTION_TYPES)
    .required(),
  points: Joi.number().positive().required(),
  position: Joi.number().integer().positive().required(),
  correctAnswer: Joi.string().trim().allow("", null).optional(),
  options: Joi.array().items(optionSchema).optional(),
}).custom((value, helpers) => {
  if (value.options) {
    if (value.type === "MULTIPLE_CHOICE" && value.options.length < 2) {
      return helpers.message('"options" must contain at least 2 items for MULTIPLE_CHOICE questions');
    }

    if (value.type === "TRUE_FALSE" && value.options.length !== 2) {
      return helpers.message('"options" must contain exactly 2 items for TRUE_FALSE questions');
    }
  }

  return value;
});

const uuidSchema = Joi.string().uuid().required();

const formatValidationError = (error) => {
  return error.details.map((detail) => detail.message).join("; ");
};

const validateQuestionPayload = (payload, options = {}) => {
  const { requireOptionsForChoice = false } = options;
  const { value, error } = questionPayloadSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const validationError = new Error(formatValidationError(error));
    validationError.statusCode = 400;
    throw validationError;
  }

  if (
    requireOptionsForChoice &&
    ["MULTIPLE_CHOICE", "TRUE_FALSE"].includes(value.type) &&
    !value.options
  ) {
    const validationError = new Error(
      '"options" is required for MULTIPLE_CHOICE and TRUE_FALSE questions'
    );
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
  QUESTION_TYPES,
  validateQuestionPayload,
  validateUuid,
};
