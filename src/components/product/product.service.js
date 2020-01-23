import urlSlug from 'url-slug';

import ProductDTO from './product.dto';
import * as ProductDAL from './product.dal';
import * as ProductValidation from './validation/product.validation';
import {
  DTO as ProductImageDTO,
  Validation as ProductImageValidation,
  Service as ProductImageService,
} from './components/productImage';
import {
  DTO as ProductVideoDTO,
  Validation as ProductVideoValidation,
} from './components/productVideo';

import * as Pagination from '@libraries/pagination';

//Global errors
import { InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import {
  ProductNotFoundError,
  ProductAlreadyExistsError,
  ProductIsPublishedError,
  MainImageAlreadyExistsError,
  CoverPageImageAlreadyExistsError,
} from './Error';

export const create = async productDTOParameter => {
  try {
    //parameter validation
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    //run validation. Returns exceptions if fails
    await ProductValidation.createProductSchema.validate(productDTOParameter);

    const newData = {
      slug: urlSlug(productDTOParameter.name),
    };

    //Check if exists some product with same name
    const productDTOResult = await ProductDAL.getOne({ slug: newData.slug });
    if (productDTOResult) throw new ProductAlreadyExistsError();

    //Check if date start is minor than date end --> DO IN VALIDATION
    // if (productDTOParameter.startedDate > productDTOParameter.finishedDate)
    // throw new ProductInvalidDateError('Start date can not be greater than Finish.');

    const productDTO = Object.assign(
      Object.create(Object.getPrototypeOf(productDTOParameter)),
      productDTOParameter,
      newData,
    );

    const product = await ProductDAL.create(productDTO);

    return product;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async productDTOParameter => {
  try {
    //parameter validation
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    await ProductValidation.updateProductSchema.validate(productDTOParameter);

    const productDTOResult = await ProductDAL.getOneById(productDTOParameter.id);
    if (!productDTOResult) throw new ProductNotFoundError();

    const newData = {};

    //check if exists product
    if (productDTOParameter.name.trim() != productDTOResult.name.trim()) {
      newData.slug = urlSlug(productDTOParameter.name);
      //Check if exists some user with slug/company name received
      const productDTOSlugResult = await ProductDAL.getOne({ slug: newData.slug });
      if (productDTOSlugResult) throw new ProductAlreadyExistsError();
    }

    const productDTO = Object.assign(
      Object.create(Object.getPrototypeOf(productDTOParameter)),
      productDTOParameter,
      newData,
    );

    //If publish = true check if has main & cover page images.
    if (productDTO.published) {
      const hasMainImage = await ProductImageService.hasMainImage(productDTOResult, false);
      if (hasMainImage)
        throw new MainImageAlreadyExistsError(
          'Can not publish product if does not exists main image.',
        );
      const hasCoverPage = await ProductImageService.hasCoverPageImage(productDTOResult, false);
      if (hasCoverPage)
        throw new CoverPageImageAlreadyExistsError(
          'Can not publish product if does not exists cover page image.',
        );
    }

    const product = await ProductDAL.update(productDTO);

    return product;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async productDTOParameter => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');
    //validate
    await ProductValidation.updateProductSchema.validate(productDTOParameter);

    const productDTOResult = await ProductDAL.getOneById(productDTOParameter.id);
    if (!productDTOResult) throw new ProductNotFoundError();

    if (productDTOResult.published) throw new ProductIsPublishedError();

    await ProductDAL.remove(productDTOResult);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOne = async productDTOParameter => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    //validate
    await ProductValidation.getProductSchema.validate(productDTOParameter);

    //check if exists id and if not find by email
    const productDTOResult = await ProductDAL.getOneById(productDTOParameter.id);

    if (!productDTOResult) throw new ProductNotFoundError();

    //returns DTO without password
    return productDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await ProductDAL.getAll({}, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      products: result.products,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const addImage = async (productDTOParameter, productImageDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    await ProductImageValidation.createProductImageSchema.validate(productImageDTOParameter);

    //check get productDTO and check if ...
    const productDTOResult = await getOne(productDTOParameter);

    //check if exist another main image - returns exception
    if (productImageDTOParameter.main) await ProductImageService.hasMainImage(productDTOResult);

    //check if exist cover page - returns exception
    if (productImageDTOParameter.coverPage)
      await ProductImageService.hasCoverPageImage(productDTOResult);

    const productImageDTO = await ProductImageService.saveFile(productImageDTOParameter);
    const productDTO = await ProductDAL.addImage(productDTOParameter, productImageDTO);

    if (!productDTO) throw new ProductNotFoundError('Product or Image does not exists.');

    return productDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

//TODO: Check another way to update. Current are changing IDs after update.
export const updateImage = async (productDTOParameter, productImageDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    await ProductImageValidation.updateProductImageSchema.validate(productImageDTOParameter);

    const newData = {};

    const productDTOResult = await getOne(productDTOParameter);
    const indexImageDTOResult = await ProductImageService.getOneById(
      productDTOResult,
      productImageDTOParameter,
    );

    if (!productDTOResult.images[indexImageDTOResult].main && productImageDTOParameter.main)
      await ProductImageService.hasMainImage(productDTOResult);

    if (
      !productDTOResult.images[indexImageDTOResult].coverPage &&
      productImageDTOParameter.coverPage
    )
      await ProductImageService.hasCoverPageImage(productDTOResult);

    //TODO: NO LLAMAR AUTENTICAR 2 VECES EN EL CDN.
    if (productImageDTOParameter.imageFile) {
      //remove file
      const newProductImageDTO = await ProductImageService.updateFile(
        productDTOResult.images[indexImageDTOResult],
        productImageDTOParameter,
      );
      newData.path = newProductImageDTO.path;
    }
    newData.title = productImageDTOParameter.title;
    newData.imageFile = productImageDTOParameter.imageFile;
    newData.main = productImageDTOParameter.main;
    newData.coverPage = productImageDTOParameter.coverPage;
    newData.published = productImageDTOParameter.published;

    const productImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(productDTOResult.images[indexImageDTOResult])),
      productDTOResult.images[indexImageDTOResult],
      newData,
    );

    const updateImageResult = await ProductDAL.updateImage(productDTOParameter, productImageDTO);

    if (!updateImageResult) throw new ProductNotFoundError('Product or Image does not exists.');

    const { productDTO } = updateImageResult;

    return { productDTO, productImageDTO };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const removeImage = async (productDTOParameter, productImageDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    await ProductImageValidation.updateProductImageSchema.validate(productImageDTOParameter);

    const removeImageResult = await ProductDAL.removeImage(
      productDTOParameter,
      productImageDTOParameter,
    );

    if (!removeImageResult) throw new ProductNotFoundError('Product or Image does not exists.');

    const { productDTO, productImageDTORemoved } = removeImageResult;
    //Remove File by PATH.
    await ProductImageService.removeFile(productImageDTORemoved);

    return productDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const addVideo = async (productDTOParameter, productVideoDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productVideoDTOParameter instanceof ProductVideoDTO))
      throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

    await ProductVideoValidation.createProductVideoSchema.validate(productVideoDTOParameter);

    const productDTO = await ProductDAL.addVideo(productDTOParameter, productVideoDTOParameter);

    if (!productDTO) throw new ProductNotFoundError('Product or Video does not exists.');

    return productDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const updateVideo = async (productDTOParameter, productVideoDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productVideoDTOParameter instanceof ProductVideoDTO))
      throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

    await ProductVideoValidation.updateProductVideoSchema.validate(productVideoDTOParameter);

    const removeVideoResult = await ProductDAL.updateVideo(
      productDTOParameter,
      productVideoDTOParameter,
    );

    if (!removeVideoResult) throw new ProductNotFoundError('Product or Video does not exists.');

    const { productDTO, productVideoDTO } = removeVideoResult;

    return { productDTO, productVideoDTO };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const removeVideo = async (productDTOParameter, productVideoDTOParameter) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    if (!(productVideoDTOParameter instanceof ProductVideoDTO))
      throw new InstanceofError('Param sent need to be an ProductVideoDTO.');

    await ProductVideoValidation.updateProductVideoSchema.validate(productVideoDTOParameter);

    const removeVideoResult = await ProductDAL.removeVideo(
      productDTOParameter,
      productVideoDTOParameter,
    );

    if (!removeVideoResult) throw new ProductNotFoundError('Product or Video does not exists.');

    const { productDTO } = removeVideoResult;

    return productDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const publicGetOne = async productDTOParameter => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    //validate
    await ProductValidation.getPublicProductSchema.validate(productDTOParameter);

    //check if exists id and if not find by email
    const productDTOResult = await ProductDAL.getOne(
      {
        slug: productDTOParameter.slug,
        published: true,
      },
      {
        createdDate: undefined,
        startedDate: undefined,
        finishedDate: undefined,
        status: undefined,
      },
    );

    if (!productDTOResult) throw new ProductNotFoundError();

    //returns DTO without password
    return productDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const publicGetAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await ProductDAL.getAll(
      {
        createdDate: undefined,
        startedDate: undefined,
        finishedDate: undefined,
        status: undefined,
      },
      pagination,
      {
        published: true,
      },
    );

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      products: result.products,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
