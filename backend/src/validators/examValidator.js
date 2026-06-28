const Joi = require("joi");

const isoDate = Joi.date().iso().allow(null);

const examPayloadSchema = Joi.object({
  title: Joi.string().trim().min(3).max(180).required(),
  description: Joi.string().trim().allow("", null).optional(),
  durationMinutes: Joi.number().integer().positive().required(),
  startsAt: isoDate.optional(),
  endsAt: isoDate.optional(),
}).custom((value, helpers) => {
  if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
    return helpers.message('"endsAt" must be after "startsAt"');
  }

  return value;
});

const examIdSchema = Joi.string().uuid().required();

const formatValidationError = (error) => {
  return error.details.map((detail) => detail.message).join("; ");
};

const validateExamPayload = (payload) => {
  const { value, error } = examPayloadSchema.validate(payload, {
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

const validateExamId = (id) => {
  const { value, error } = examIdSchema.validate(id);

  if (error) {
    const validationError = new Error("Invalid exam id.");
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
};

module.exports = {
  validateExamPayload,
  validateExamId,
};
