import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);

const vatchema = Joi.string()
  .min(2)
  .max(50);
const swiftSchema = Joi.string()
  .min(2)
  .max(50);
const ibanSchema = Joi.string();
const routeNumberSchema = Joi.string()
  .min(2)
  .max(50);
const bankNameSchema = Joi.string()
  .min(2)
  .max(50);

const statusSchema = Joi.string();
const userSchema = Joi.object();

export const createEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    vat: vatchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    vat: vatchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const getEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    vat: vatchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });
