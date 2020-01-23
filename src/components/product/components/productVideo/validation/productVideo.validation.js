import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);
const titleSchema = Joi.string()
  .min(2)
  .max(50);
const urlSchema = Joi.string().uri();
const publishedSchema = Joi.boolean();
const sourceSchema = Joi.string();

const createdDateSchema = Joi.date();

export const createProductVideoSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    title: titleSchema.required(),
    published: publishedSchema.optional().allow(''),
    url: urlSchema.optional().required(),
    source: sourceSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateProductVideoSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    title: titleSchema.optional().allow(''),
    published: publishedSchema.optional().allow(''),
    url: urlSchema.optional().allow(''),
    source: sourceSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
  })
  .options({ abortEarly: false });
