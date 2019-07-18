import Joi from '@hapi/joi';

const emailSchema = Joi.string()
  .email()
  .lowercase()
  .min(4)
  .max(62);

const nameSchema = Joi.string()
  .min(3)
  .max(50);

const subjectSchema = Joi.string()
  .min(3)
  .max(50);

const messageSchema = Joi.string()
  .min(10)
  .max(300);

export const sendContactSchema = Joi.object().keys({
  name: nameSchema.required(),
  email: emailSchema.required(),
  subject: subjectSchema.required(),
  message: messageSchema.required(),
});
