import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);

/*
  TODO: Think about add regexpression for urls
*/

const companyNameSchema = Joi.string()
  .min(2)
  .max(50);
const descriptionSchema = Joi.string();
const logoSchema = Joi.string();
const slugSchema = Joi.string();
const cifSchema = Joi.string()
  .min(9)
  .max(11);
const fiscalAddressSchema = Joi.string();
const phoneSchema = Joi.string()
  .min(9)
  .max(11);
const publicSchema = Joi.boolean();
const socialLinkedinSchema = Joi.string().uri();
const socialFacebookSchema = Joi.string().uri();
const socialInstagramSchema = Joi.string().uri();
const webSchema = Joi.string().uri();
const createdDateSchema = Joi.date();
const userSchema = Joi.object();
const logoFileSchema = Joi.object();

export const createClientSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    companyName: companyNameSchema.required(),
    slug: slugSchema.optional().allow(''),
    logo: logoSchema.optional().allow(''),
    logoFile: logoFileSchema.optional().allow(''),
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

export const updateClientSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    companyName: companyNameSchema.optional().allow(''),
    slug: slugSchema.optional().allow(''),
    logo: logoSchema.optional().allow(''),
    logoFile: logoFileSchema.optional().allow(''),
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

export const getClientSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    companyName: companyNameSchema.optional(),
    slug: slugSchema.optional(),
    logo: logoSchema.optional(),
    logoFile: logoFileSchema.optional(),
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
