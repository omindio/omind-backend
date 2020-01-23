import { ImageResize, Backblaze } from '@libraries';
import { InstanceofError, MissingParameterError } from '@libraries/Error';

import {
  MainImageAlreadyExistsError,
  ImageNotFoundError,
  CoverPageImageAlreadyExistsError,
} from '../../Error';

import ProductDTO from '../../product.dto';
import ProductImageDTO from './productImage.dto';

//will return index of imageDTO or exception
export const getOneById = async (ProductDTOParameter, productImageDTOParameter) => {
  try {
    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    if (!productImageDTOParameter.id) throw new MissingParameterError(['id']);

    const productImageDTO = ProductDTOParameter.images.findIndex(function(image) {
      return image.id === productImageDTOParameter.id;
    });

    if ((productImageDTO != 0 && !productImageDTO) || productImageDTO === -1)
      throw new ImageNotFoundError('Image does not exists.');

    return productImageDTO;
  } catch (err) {
    throw err;
  }
};

//will return main image index or null
export const hasMainImage = async (productDTOParameter, throwException = true) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    productDTOParameter.images.map(image => {
      if (image.main) {
        if (throwException) {
          throw new MainImageAlreadyExistsError(
            'Can not add this image as main because another exists.',
          );
        } else {
          return true;
        }
      }
    });
    return false;
  } catch (err) {
    throw err;
  }
};

//will return coverPageImage index or null
export const hasCoverPageImage = async (productDTOParameter, throwException = true) => {
  try {
    if (!(productDTOParameter instanceof ProductDTO))
      throw new InstanceofError('Param sent need to be an ProductDTO.');

    productDTOParameter.images.map(image => {
      if (image.coverPage)
        if (throwException) {
          throw new CoverPageImageAlreadyExistsError(
            'Can not add this image as cover page because another exists.',
          );
        } else {
          return true;
        }
    });
    return false;
  } catch (err) {
    throw err;
  }
};

//will return productImageDTO with path completed
export const saveFile = async productImageDTOParameter => {
  try {
    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    const imageResize = new ImageResize();
    const { filePath, fileName } = await imageResize.resize(
      productImageDTOParameter.imageFile.buffer,
    );

    const b2 = new Backblaze();
    await b2.authorize();
    await b2.uploadFile(filePath, fileName);

    const productImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(productImageDTOParameter)),
      productImageDTOParameter,
      {
        path: fileName,
      },
    );

    return productImageDTO;
  } catch (err) {
    throw err;
  }
};

export const updateFile = async (
  removeProductImageDTOParameter,
  createProductImageDTOParameter,
) => {
  try {
    if (
      !(removeProductImageDTOParameter instanceof ProductImageDTO) ||
      !(createProductImageDTOParameter instanceof ProductImageDTO)
    )
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    const b2 = new Backblaze();
    await b2.authorize();
    await b2.removeFile(removeProductImageDTOParameter.path);

    const imageResize = new ImageResize();
    const { filePath, fileName } = await imageResize.resize(
      createProductImageDTOParameter.imageFile.buffer,
    );

    await b2.uploadFile(filePath, fileName);

    const productImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(createProductImageDTOParameter)),
      createProductImageDTOParameter,
      {
        path: fileName,
      },
    );

    return productImageDTO;
  } catch (err) {
    throw err;
  }
};

export const removeFile = async productImageDTOParameter => {
  try {
    if (!(productImageDTOParameter instanceof ProductImageDTO))
      throw new InstanceofError('Param sent need to be an ProductImageDTO.');

    const { path } = productImageDTOParameter;

    if (path) {
      const b2 = new Backblaze();
      await b2.authorize();
      await b2.removeFile(path);
    }
  } catch (err) {
    throw err;
  }
};
