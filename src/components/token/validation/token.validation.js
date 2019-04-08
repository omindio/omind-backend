import Joi from 'joi';
import { types as Type } from '../config/types';

//TODO: INTL Validation messages
//TODO: Correct validation of id
const idSchema = Joi.string().alphanum().length(24);
const userIdSchema = Joi.string().alphanum().length(24);
const tokenSchema = Joi.string().alphanum();
const typeSchema = Joi.string().valid(Type.RecoverPassword, Type.ConfirmRegistration);
const createdAtSchema = Joi.date();

export const createTokenSchema = Joi.object().keys({
    id: idSchema.optional(),
    userId: userIdSchema.required(),
    token: tokenSchema.optional(),
    createdAt: createdAtSchema.optional(),
    type: typeSchema.required()
}).options({ abortEarly: false });

export const confirmTokenSchema = Joi.object().keys({
    id: idSchema.optional(),
    userId: userIdSchema.optional(),
    token: tokenSchema.required(),
    createdAt: createdAtSchema.optional(),
    type: typeSchema.optional()
}).options({ abortEarly: false });

export const resetTokenSchema = Joi.object().keys({
    id: idSchema.optional(),
    userId: userIdSchema.required(),
    token: tokenSchema.optional(),
    createdAt: createdAtSchema.optional(),
    type: typeSchema.optional()
}).options({ abortEarly: false });
