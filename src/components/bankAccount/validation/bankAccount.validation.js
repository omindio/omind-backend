import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);

const vatSchema = Joi.string()
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
const userSchema = Joi.string()
  .alphanum()
  .length(24);
const createdDateSchema = Joi.date();

export const createBankAccountSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    vat: vatSchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateBankAccountSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    vat: vatSchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const removeByUserBankAccountSchema = Joi.object()
  .keys({
    id: idSchema.optional().allow(''),
    vat: vatSchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.required(),
  })
  .options({ abortEarly: false });

export const getBankAccountSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    vat: vatSchema.optional().allow(''),
    swift: swiftSchema.optional().allow(''),
    iban: ibanSchema.optional().allow(''),
    routeNumber: routeNumberSchema.optional().allow(''),
    bankName: bankNameSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });
