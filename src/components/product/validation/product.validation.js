import BaseJoi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';

const Joi = BaseJoi.extend(JoiDate);

const idSchema = Joi.string()
  .alphanum()
  .length(24);
const nameSchema = Joi.string()
  .min(2)
  .max(50);
const slugSchema = Joi.string();
const facebookUrlSchema = Joi.string().uri();
const instagramUrlSchema = Joi.string().uri();
const linkedinUrlSchema = Joi.string().uri();
const webUrlSchema = Joi.string().uri();
const youtubeUrlSchema = Joi.string().uri();
const soundcloudUrlSchema = Joi.string().uri();
const descriptionSchema = Joi.string()
  .min(10)
  .max(1000);
const metaDescriptionSchema = Joi.string()
  .min(2)
  .max(250);
const startedDateSchema = Joi.date();
const finishedDateSchema = Joi.date();
const publishedSchema = Joi.boolean();
const statusSchema = Joi.string()
  .min(1)
  .max(2);
const tagsSchema = Joi.array();
const imagesSchema = Joi.array();
const createdDateSchema = Joi.date();

export const createProductSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    name: nameSchema.required(),
    description: descriptionSchema.required(),
    slug: slugSchema.optional().allow(''),
    metaDescription: metaDescriptionSchema.optional().allow(''),
    startedDate: startedDateSchema.required(),
    finishedDate: finishedDateSchema.greater(Joi.ref('startedDate')).required(),
    published: publishedSchema.optional().allow(''),
    status: statusSchema.required(),
    tags: tagsSchema.optional().allow(''),
    images: imagesSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    facebookUrl: facebookUrlSchema.optional().allow(''),
    instagramUrl: instagramUrlSchema.optional().allow(''),
    linkedinUrl: linkedinUrlSchema.optional().allow(''),
    youtubeUrl: youtubeUrlSchema.optional().allow(''),
    soundcloudUrl: soundcloudUrlSchema.optional().allow(''),
    webUrl: webUrlSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const updateProductSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    name: nameSchema.optional().allow(''),
    description: descriptionSchema.optional().allow(''),
    slug: slugSchema.optional().allow(''),
    metaDescription: metaDescriptionSchema.optional().allow(''),
    startedDate: startedDateSchema.optional().allow(''),
    finishedDate: finishedDateSchema
      .greater(Joi.ref('startedDate'))
      .optional()
      .allow(''),
    published: publishedSchema.optional().allow(''),
    status: statusSchema.optional().allow(''),
    tags: tagsSchema.optional().allow(''),
    images: imagesSchema.optional().allow(''),
    createdDate: createdDateSchema.optional().allow(''),
    facebookUrl: facebookUrlSchema.optional().allow(''),
    instagramUrl: instagramUrlSchema.optional().allow(''),
    linkedinUrl: linkedinUrlSchema.optional().allow(''),
    youtubeUrl: youtubeUrlSchema.optional().allow(''),
    soundcloudUrl: soundcloudUrlSchema.optional().allow(''),
    webUrl: webUrlSchema.optional().allow(''),
  })
  .options({ abortEarly: false });

export const getProductSchema = Joi.object()
  .keys({
    id: idSchema.required(),
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    slug: slugSchema.optional(),
    metaDescription: metaDescriptionSchema.optional(),
    startedDate: startedDateSchema.optional(),
    finishedDate: finishedDateSchema.optional(),
    published: publishedSchema.optional(),
    status: statusSchema.optional(),
    tags: tagsSchema.optional(),
    images: imagesSchema.optional(),
    createdDate: createdDateSchema.optional(),
    facebookUrl: facebookUrlSchema.optional(),
    instagramUrl: instagramUrlSchema.optional(),
    youtubeUrl: youtubeUrlSchema.optional(),
    soundcloudUrl: soundcloudUrlSchema.optional(),
    linkedinUrl: linkedinUrlSchema.optional(),
    webUrl: webUrlSchema.optional(),
  })
  .options({ abortEarly: false });

export const getPublicProductSchema = Joi.object()
  .keys({
    id: idSchema.optional(),
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    slug: slugSchema.required(),
    metaDescription: metaDescriptionSchema.optional(),
    startedDate: startedDateSchema.optional(),
    finishedDate: finishedDateSchema.optional(),
    published: publishedSchema.optional(),
    status: statusSchema.optional(),
    tags: tagsSchema.optional(),
    images: imagesSchema.optional(),
    createdDate: createdDateSchema.optional(),
    facebookUrl: facebookUrlSchema.optional(),
    instagramUrl: instagramUrlSchema.optional(),
    linkedinUrl: linkedinUrlSchema.optional(),
    youtubeUrl: youtubeUrlSchema.optional(),
    soundcloudUrl: soundcloudUrlSchema.optional(),
    webUrl: webUrlSchema.optional(),
  })
  .options({ abortEarly: false });
