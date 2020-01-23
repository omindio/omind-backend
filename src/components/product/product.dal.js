//Data Access Layer
import _pickBy from 'lodash.pickby';
import ProductModel from './product.model';
import ProductDTO from './product.dto';
import { DTO as ProductImageDTO } from './components/productImage';
import { DTO as ProductVideoDTO } from './components/productVideo';

import { InstanceofError } from '@libraries/Error';

export const getOne = async (params, excludeFields = {}) => {
  try {
    const productResult = await ProductModel.findOne(params);

    if (productResult) {
      const productDTO = new ProductDTO(productResult);

      const product = Object.assign(
        Object.create(Object.getPrototypeOf(productDTO)),
        productDTO,
        {
          images: _getProductImagesDTOArray(productResult.images),
          videos: _getProductVideosDTOArray(productResult.videos),
        },
        excludeFields,
      );

      return product;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const productResult = await ProductModel.findById(idParameter);
    if (productResult) {
      const productDTO = new ProductDTO(productResult);

      const product = Object.assign(Object.create(Object.getPrototypeOf(productDTO)), productDTO, {
        images: _getProductImagesDTOArray(productResult.images),
        videos: _getProductVideosDTOArray(productResult.videos),
      });
      return product;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (excludeFields = {}, pagination, filter = {}) => {
  try {
    const products = await ProductModel.find(filter)
      .sort({ finishedDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);

    const count = await ProductModel.countDocuments();
    const productsDTOArray = [];

    products.forEach(product => {
      const productDTO = new ProductDTO(product);
      const images = _getProductImagesDTOArray(product.images);
      const videos = _getProductVideosDTOArray(product.videos);

      productsDTOArray.push(
        Object.assign(
          Object.create(Object.getPrototypeOf(productDTO)),
          productDTO,
          { images, videos },
          excludeFields,
        ),
      );
    });
    return {
      products: productsDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async productDTOParameter => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    const productDTO = _pickBy(productDTOParameter);
    const productModel = new ProductModel(productDTO);
    const product = await productModel.save();
    return new ProductDTO(product);
  } catch (err) {
    throw err;
  }
};

export const update = async productDTOParameter => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    const productDTOClean = _pickBy(
      productDTOParameter,
      v => v !== null && v !== undefined && v !== '',
    );
    const productResult = await ProductModel.findOneAndUpdate(
      { _id: productDTOClean.id },
      productDTOClean,
      {
        new: true,
      },
    );
    const productDTO = new ProductDTO(productResult);
    const product = Object.assign(Object.create(Object.getPrototypeOf(productDTO)), productDTO, {
      images: _getProductImagesDTOArray(productResult.images),
      videos: _getProductVideosDTOArray(productResult.videos),
    });
    return product;
  } catch (err) {
    throw err;
  }
};

export const remove = async productDTOParameter => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  try {
    await ProductModel.findOneAndRemove({ _id: productDTOParameter.id });
  } catch (err) {
    throw err;
  }
};

export const addImage = async (productDTOParameter, productImageDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productImageDTOParameter instanceof ProductImageDTO))
    throw new InstanceofError('Param sent need to be an ProductImageDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      productModel.images.push(productImageDTOParameter);
      const product = await productModel.save();

      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );
      return productDTO;
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const updateImage = async (productDTOParameter, productImageDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productImageDTOParameter instanceof ProductImageDTO))
    throw new InstanceofError('Param sent need to be an ProductImageDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      const image = productModel.images.id(productImageDTOParameter.id);
      if (!image) return null;

      image.set(productImageDTOParameter);

      const product = await productModel.save();

      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );

      return { productDTO, productImageDTO: _getProductImageDTO(image) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const removeImage = async (productDTOParameter, productImageDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productImageDTOParameter instanceof ProductImageDTO))
    throw new InstanceofError('Param sent need to be an ProductImageDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      const image = productModel.images.id(productImageDTOParameter.id);
      if (!image) return null;

      productModel.images.pull(productImageDTOParameter.id);
      const product = await productModel.save();
      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );
      return { productDTO, productImageDTORemoved: _getProductImageDTO(image) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const addVideo = async (productDTOParameter, productVideoDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productVideoDTOParameter instanceof ProductVideoDTO))
    throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      productModel.videos.push(productVideoDTOParameter);
      const product = await productModel.save();

      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );
      return productDTO;
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const updateVideo = async (productDTOParameter, productVideoDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productVideoDTOParameter instanceof ProductVideoDTO))
    throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      const video = productModel.videos.id(productVideoDTOParameter.id);
      if (!video) return null;

      video.set(productVideoDTOParameter);

      const product = await productModel.save();

      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );

      return { productDTO, productVideoDTO: _getProductVideoDTO(video) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const removeVideo = async (productDTOParameter, productVideoDTOParameter) => {
  if (!(productDTOParameter instanceof ProductDTO))
    throw new InstanceofError('Param sent need to be an ProductDTO.');

  if (!(productVideoDTOParameter instanceof ProductVideoDTO))
    throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

  try {
    const productModel = await ProductModel.findById(productDTOParameter.id);

    if (productModel) {
      const video = productModel.videos.id(productVideoDTOParameter.id);
      if (!video) return null;

      productModel.videos.pull(productVideoDTOParameter.id);
      const product = await productModel.save();
      const productDTO = Object.assign(
        Object.create(Object.getPrototypeOf(productDTOParameter)),
        productDTOParameter,
        product.toJSON(),
      );
      return { productDTO, productVideoDTORemoved: _getProductVideoDTO(video) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const _getProductImagesDTOArray = productImagesArray => {
  const productImagesDTOArray = [];

  productImagesArray.forEach(productImage => {
    const productImageDTO = _getProductImageDTO(productImage);
    productImagesDTOArray.push(
      Object.assign(Object.create(Object.getPrototypeOf(productImageDTO)), productImageDTO, {}),
    );
  });

  return productImagesDTOArray;
};

const _getProductImageDTO = productImage => {
  const productImageDTO = new ProductImageDTO(productImage);
  return Object.assign(Object.create(Object.getPrototypeOf(productImageDTO)), productImageDTO, {});
};

const _getProductVideosDTOArray = productVideosArray => {
  const productVideosDTOArray = [];

  productVideosArray.forEach(productVideo => {
    const productVideoDTO = _getProductVideoDTO(productVideo);
    productVideosDTOArray.push(
      Object.assign(Object.create(Object.getPrototypeOf(productVideoDTO)), productVideoDTO, {}),
    );
  });

  return productVideosDTOArray;
};

const _getProductVideoDTO = productVideo => {
  const productVideoDTO = new ProductVideoDTO(productVideo);
  return Object.assign(Object.create(Object.getPrototypeOf(productVideoDTO)), productVideoDTO, {});
};
