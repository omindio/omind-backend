import Joi from 'joi';
import { roles as Role } from '../config/roles';

//TODO: INTL Validation messages

const _idSchema = Joi.string().alphanum().length(24);
const nameSchema = Joi.string().min(3).max(50);
const lastNameSchema = Joi.string().min(3).max(50);
const emailSchema = Joi.string().email().lowercase().min(4).max(62);
const passwordSchema = Joi.string().min(8).strip();
const roleSchema = Joi.string().valid(Role.User, Role.Admin).default(Role.User);
const createdDateSchema = Joi.date();

export const createUserSchema = Joi.object().keys({
    _id: _idSchema.optional(),
    role: roleSchema.required(),
    name: nameSchema.required(),
    lastName: lastNameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    createdDate: createdDateSchema.optional()
}).options({ abortEarly: false });

export const updateUserSchema = Joi.object().keys({
    _id: _idSchema.required(),
    role: roleSchema.optional().allow(''),
    name: nameSchema.optional().allow(''),
    lastName: lastNameSchema.optional().allow(''),
    email: emailSchema.optional().allow(''),
    password: passwordSchema.optional().allow(''),
    createdDate: createdDateSchema.optional()
}).options({ abortEarly: false });
