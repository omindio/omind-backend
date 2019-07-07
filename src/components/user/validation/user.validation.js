import Joi from 'joi';
import { Role } from '../config';

//TODO: INTL Validation messages
//TODO: Correct validation of ID
const idSchema = Joi.string()
  .alphanum()
  .length(24);
const nameSchema = Joi.string()
  .min(3)
  .max(50);
const lastNameSchema = Joi.string()
  .min(3)
  .max(50);
const emailSchema = Joi.string()
  .email()
  .lowercase()
  .min(4)
  .max(62);
const passwordSchema = Joi.string()
  .min(8)
  .strip();
const roleSchema = Joi.string()
  .valid(Role.User, Role.Admin, Role.Client, Role.Employee)
  .default(Role.User);
const isVerifiedSchema = Joi.boolean();
const createdDateSchema = Joi.date();

export const createUserSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    role: roleSchema.optional(),
    name: nameSchema.required(),
    lastName: lastNameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    isVerified: isVerifiedSchema.optional(),
    createdDate: createdDateSchema.optional(),
  })
  .options({ abortEarly: false });

export const updateUserSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    role: roleSchema.optional().allow(''),
    name: nameSchema.optional().allow(''),
    lastName: lastNameSchema.optional().allow(''),
    email: emailSchema.optional().allow(''),
    password: passwordSchema.optional().allow(''),
    isVerified: isVerifiedSchema.optional(),
    createdDate: createdDateSchema.optional(),
  })
  .options({ abortEarly: false });

export const getUserSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    role: roleSchema.optional(),
    name: nameSchema.optional(),
    lastName: lastNameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    isVerified: isVerifiedSchema.optional(),
    createdDate: createdDateSchema.optional(),
  })
  .options({ abortEarly: false });
