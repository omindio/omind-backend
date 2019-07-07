import Joi from 'joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);

const companyNameSchema = Joi.string();
const descriptionSchema = Joi.string();
const logoSchema = Joi.string();
const slugSchema = Joi.string();
const cifSchema = Joi.string();
const fiscalAddressSchema = Joi.string();
const phoneSchema = Joi.string();
const publicSchema = Joi.boolean();
const socialLinkedinSchema = Joi.string();
const socialFacebookSchema = Joi.string();
const socialInstagramSchema = Joi.string();
const webSchema = Joi.string();
const createdDateSchema = Joi.date();
const userSchema = Joi.object();

export const createClientSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    companyName: companyNameSchema.required(),
    slug: slugSchema.optional().allow(''),
    logo: logoSchema.optional().allow(''),
    description: descriptionSchema.optional().allow(''),
    cif: cifSchema.optional().allow(''),
    fiscalAddress: fiscalAddressSchema.optional().allow(''),
    phone: phoneSchema.optional().allow(''),
    //bankAccount: createdAtSchema.optional(),
    public: publicSchema.optional().allow(''),
    socialLinkedin: socialLinkedinSchema.optional().allow(''),
    socialFacebook: socialFacebookSchema.optional().allow(''),
    socialInstagram: socialInstagramSchema.optional().allow(''),
    web: webSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    user: userSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

/*
export const updateUserSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    role: roleSchema.optional().allow(''),
    name: nameSchema.optional().allow(''),
    lastName: lastNameSchema.optional().allow(''),
    email: emailSchema.optional().allow(''),
    password: passwordSchema.optional().allow(''),
    isVerified: isVerifiedSchema.optional(),
    createdAt: createdAtSchema.optional(),
  })
  .options({ abortEarly: false });
*/

export const getClientSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    companyName: companyNameSchema.optional(),
    slug: slugSchema.optional(),
    logo: logoSchema.optional(),
    description: descriptionSchema.optional(),
    cif: cifSchema.optional(),
    fiscalAddress: fiscalAddressSchema.optional(),
    phone: phoneSchema.optional(),
    //bankAccount: createdAtSchema.optional(),
    public: publicSchema.optional(),
    socialLinkedin: socialLinkedinSchema.optional(),
    socialFacebook: socialFacebookSchema.optional(),
    socialInstagram: socialInstagramSchema.optional(),
    web: webSchema.optional(),
    createdDate: createdDateSchema.optional(),
    user: userSchema.optional(),
  })
  .options({ abortEarly: false });
