import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);

const workPositionSchema = Joi.string()
  .min(2)
  .max(50);
const dniSchema = Joi.string()
  .min(9)
  .max(11);
const fiscalAddressSchema = Joi.string();
const phoneSchema = Joi.string()
  .min(9)
  .max(11);
const socialLinkedinSchema = Joi.string().uri();
const socialFacebookSchema = Joi.string().uri();
const socialInstagramSchema = Joi.string().uri();
const webSchema = Joi.string().uri();
const createdDateSchema = Joi.date();
const userSchema = Joi.object();

export const createEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    workPosition: workPositionSchema.optional().allow(''),
    dni: dniSchema.optional().allow(''),
    fiscalAddress: fiscalAddressSchema.optional().allow(''),
    phone: phoneSchema.optional().allow(''),
    socialLinkedin: socialLinkedinSchema.optional().allow(''),
    socialFacebook: socialFacebookSchema.optional().allow(''),
    socialInstagram: socialInstagramSchema.optional().allow(''),
    web: webSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    workPosition: workPositionSchema.optional().allow(''),
    dni: dniSchema.optional().allow(''),
    fiscalAddress: fiscalAddressSchema.optional().allow(''),
    phone: phoneSchema.optional().allow(''),
    socialLinkedin: socialLinkedinSchema.optional().allow(''),
    socialFacebook: socialFacebookSchema.optional().allow(''),
    socialInstagram: socialInstagramSchema.optional().allow(''),
    web: webSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const getEmployeeSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    workPosition: workPositionSchema.optional(),
    dni: dniSchema.optional(),
    fiscalAddress: fiscalAddressSchema.optional(),
    phone: phoneSchema.optional(),
    socialLinkedin: socialLinkedinSchema.optional(),
    socialFacebook: socialFacebookSchema.optional(),
    socialInstagram: socialInstagramSchema.optional(),
    web: webSchema.optional(),
    createdDate: createdDateSchema.optional(),
    user: userSchema.optional(),
  })
  .options({ abortEarly: false });
