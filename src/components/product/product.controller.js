import * as ProductService from './product.service';
import ProductDTO from './product.dto';

import { DTO as ProductImageDTO } from './components/productImage';
import { DTO as ProductVideoDTO } from './components/productVideo';

import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  try {
    const {
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      status,
      tags,
      employee,
      pmo,
    } = req.body;

    const tagsArray = tags ? tags.split(',') : [];

    const productDTO = new ProductDTO({
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      status,
      tags: tagsArray,
      employee,
      pmo,
    });

    const product = await ProductService.create(productDTO);
    res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role)
      throw new UnauthorizedActionError('You can not update this product.');

    const {
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      published,
      status,
      tags,
      employee,
      pmo,
      id,
    } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const tagsArray = tags ? tags.split(',') : [];
    const productDTO = new ProductDTO({
      id,
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      published,
      status,
      tags: tagsArray,
      employee,
      pmo,
    });

    const product = await ProductService.update(productDTO);
    res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;

  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    const productDTO = new ProductDTO({ id: idParameter });
    await ProductService.remove(productDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);

    const productDTO = new ProductDTO({ id: idParameter });
    const product = await ProductService.getOne(productDTO);
    res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const products = await ProductService.getAll(pageParameter, limitParameter);
    res.status(200).json(products);
  } catch (err) {
    return next(err);
  }
};

export const addVideo = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);

    const { title, source, url, published } = req.body;

    const productVideoDTO = new ProductVideoDTO({
      title,
      source,
      url,
      published: typeof published === 'string' ? published === 'true' : published,
    });
    const productDTO = new ProductDTO({ id: productIdParameter });

    const productVideo = await ProductService.addVideo(productDTO, productVideoDTO);

    res.status(201).json(productVideo);
  } catch (err) {
    return next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  const videoIdParameter = req.params.videoId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);
    if (!videoIdParameter) throw new MissingParameterError(['videoId']);

    const { title, source, url, published } = req.body;

    const productVideoDTO = new ProductVideoDTO({
      id: videoIdParameter,
      title,
      source,
      url,
      published: typeof published === 'string' ? published === 'true' : published,
    });

    const productDTO = new ProductDTO({ id: productIdParameter });

    const productVideo = await ProductService.updateVideo(productDTO, productVideoDTO);

    res.status(201).json(productVideo);
  } catch (err) {
    console.log(err);

    return next(err);
  }
};

export const removeVideo = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  const videoIdParameter = req.params.videoId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);
    if (!videoIdParameter) throw new MissingParameterError(['videoId']);

    const productVideoDTO = new ProductVideoDTO({ id: videoIdParameter });
    const productDTO = new ProductDTO({ id: productIdParameter });

    await ProductService.removeVideo(productDTO, productVideoDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const addImage = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);

    const { title, main, coverPage, published } = req.body;

    let imageFile = req.file;
    if (imageFile === undefined) imageFile = null;

    const productImageDTO = new ProductImageDTO({
      title,
      main: typeof main === 'string' ? main === 'true' : main,
      coverPage: typeof coverPage === 'string' ? coverPage === 'true' : coverPage,
      published: typeof published === 'string' ? published === 'true' : published,
      imageFile,
    });

    const productDTO = new ProductDTO({ id: productIdParameter });

    const productImage = await ProductService.addImage(productDTO, productImageDTO);

    res.status(201).json(productImage);
  } catch (err) {
    return next(err);
  }
};

export const updateImage = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  const imageIdParameter = req.params.imageId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);
    if (!imageIdParameter) throw new MissingParameterError(['imageId']);

    const { title, main, coverPage, published } = req.body;

    let imageFile = req.file;
    if (imageFile === undefined) imageFile = null;

    const productImageDTO = new ProductImageDTO({
      id: imageIdParameter,
      title,
      main: typeof main === 'string' ? main === 'true' : main,
      coverPage: typeof coverPage === 'string' ? coverPage === 'true' : coverPage,
      published: typeof published === 'string' ? published === 'true' : published,
      imageFile,
    });

    const productDTO = new ProductDTO({ id: productIdParameter });

    const productImage = await ProductService.updateImage(productDTO, productImageDTO);

    res.status(201).json(productImage);
  } catch (err) {
    return next(err);
  }
};

export const removeImage = async (req, res, next) => {
  const productIdParameter = req.params.productId;
  const imageIdParameter = req.params.imageId;
  try {
    if (!productIdParameter) throw new MissingParameterError(['productId']);
    if (!imageIdParameter) throw new MissingParameterError(['imageId']);

    const productImageDTO = new ProductImageDTO({ id: imageIdParameter });
    const productDTO = new ProductDTO({ id: productIdParameter });

    await ProductService.removeImage(productDTO, productImageDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const publicGetAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const products = await ProductService.publicGetAll(pageParameter, limitParameter);
    res.status(200).json(products);
  } catch (err) {
    return next(err);
  }
};

export const publicGetOne = async (req, res, next) => {
  const slugParameter = req.params.slug;
  try {
    if (!slugParameter) throw new MissingParameterError(['slug']);

    const productDTO = new ProductDTO({ slug: slugParameter });
    const product = await ProductService.publicGetOne(productDTO);
    res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
