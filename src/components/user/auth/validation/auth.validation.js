import Joi from 'joi';

const emailSchema = Joi.string().email().lowercase().min(4).max(62);
const passwordSchema = Joi.string().min(8).strip();


export const createAuthSchema = Joi.object().keys({
    email: emailSchema.required(),
    password: passwordSchema.required()
});
