import fs from 'fs';
import appRoot from 'app-root-path';

import { ImageResize } from '@libraries';
import { InstanceofError, MissingParameterError } from '@libraries/Error';

import {
  MainImageAlreadyExistsError,
  ImageNotFoundError,
  CoverPageImageAlreadyExistsError,
} from '../../Error';

import ProjectDTO from '../../project.dto';
import ProjectImageDTO from './projectImage.dto';

const imagePath = `${appRoot}/uploads/images`;

//will return index of imageDTO or exception
export const getOneById = async (ProjectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    if (!projectImageDTOParameter.id) throw new MissingParameterError(['id']);

    const projectImageDTO = ProjectDTOParameter.images.findIndex(function(image) {
      return image.id === projectImageDTOParameter.id;
    });

    if ((projectImageDTO != 0 && !projectImageDTO) || projectImageDTO === -1)
      throw new ImageNotFoundError('Image does not exists.');

    return projectImageDTO;
  } catch (err) {
    throw err;
  }
};

//will return object of array of imagesDTO result and imageDTORemoved or exception
/*
export const removeById = async (projectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    if (!projectImageDTOParameter.id) throw new MissingParameterError(['id']);

    const imageDTOIndex = await getOneById(projectDTOParameter, projectImageDTOParameter);

    const imageDTOResult = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOParameter.images[imageDTOIndex])),
      projectDTOParameter.images[imageDTOIndex],
    );

    //TODO: Change for filter
    projectDTOParameter.images.splice(imageDTOIndex);

    const imagesDTOArrayFiltered = projectDTOParameter.images.filter(function(image, index) {
      return projectDTOParameter.images[index].id != projectImageDTOParameter.id;
    });

    return {
      projectImageDTORemoved: imageDTOResult,
      projectImagesDTOArray: imagesDTOArrayFiltered,
    };

  } catch (err) {
    throw err;
  }
};
 */

//will return main image index or null
export const hasMainImage = async (projectDTOParameter, throwException = true) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    projectDTOParameter.images.map(image => {
      if (image.main)
        if (throwException) {
          throw new MainImageAlreadyExistsError(
            'Can not add this image as main because another exists.',
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

//will return coverPageImage index or null
export const hasCoverPageImage = async (projectDTOParameter, throwException = true) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    projectDTOParameter.images.map(image => {
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

//will return projectImageDTO with path completed
export const saveFile = async projectImageDTOParameter => {
  try {
    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    const fileUpload = new ImageResize(imagePath, 960, 748);
    const filename = await fileUpload.save(projectImageDTOParameter.imageFile.buffer);

    const projectImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectImageDTOParameter)),
      projectImageDTOParameter,
      {
        path: filename,
      },
    );

    return projectImageDTO;
  } catch (err) {
    throw err;
  }
};

export const removeFile = async projectImageDTOParameter => {
  try {
    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    if (projectImageDTOParameter.path)
      fs.unlink(`${imagePath}/${projectImageDTOParameter.path}`, err => {
        if (err) throw err;
      });
  } catch (err) {
    throw err;
  }
};
