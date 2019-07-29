import Joi from '@hapi/joi';

const idSchema = Joi.string()
  .alphanum()
  .length(24);
const titleSchema = Joi.string()
  .min(2)
  .max(50);
const publishedSchema = Joi.boolean();
const mainSchema = Joi.boolean();
const coverPageSchema = Joi.boolean();
const pathSchema = Joi.string();
const imageFileSchema = Joi.object();
const createdDateSchema = Joi.date();

export const createProjectImageSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    title: titleSchema.required(),
    published: publishedSchema.optional().allow(''),
    coverPage: coverPageSchema.optional().allow(''),
    imageFile: imageFileSchema.required(),
    main: mainSchema.optional().allow(''),
    path: pathSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateProjectImageSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    title: titleSchema.optional().allow(''),
    published: publishedSchema.optional().allow(''),
    main: mainSchema.optional().allow(''),
    coverPage: coverPageSchema.optional().allow(''),
    imageFile: imageFileSchema.optional().allow(null),
    path: pathSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
  })
  .options({ abortEarly: false });
