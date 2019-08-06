import { ImageResize, Backblaze } from '@libraries';
import { InstanceofError, MissingParameterError } from '@libraries/Error';

import {
  MainImageAlreadyExistsError,
  ImageNotFoundError,
  CoverPageImageAlreadyExistsError,
} from '../../Error';

import ProjectDTO from '../../project.dto';
import ProjectImageDTO from './projectImage.dto';

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

//will return main image index or null
export const hasMainImage = async (projectDTOParameter, throwException = true) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    projectDTOParameter.images.map(image => {
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

    const imageResize = new ImageResize();
    const { filePath, fileName } = await imageResize.resize(
      projectImageDTOParameter.imageFile.buffer,
    );

    const b2 = new Backblaze();
    await b2.authorize();
    await b2.uploadFile(filePath, fileName);

    const projectImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectImageDTOParameter)),
      projectImageDTOParameter,
      {
        path: fileName,
      },
    );

    return projectImageDTO;
  } catch (err) {
    throw err;
  }
};

export const updateFile = async (
  removeProjectImageDTOParameter,
  createProjectImageDTOParameter,
) => {
  try {
    if (
      !(removeProjectImageDTOParameter instanceof ProjectImageDTO) ||
      !(createProjectImageDTOParameter instanceof ProjectImageDTO)
    )
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    const b2 = new Backblaze();
    await b2.authorize();
    await b2.removeFile(removeProjectImageDTOParameter.path);

    const imageResize = new ImageResize();
    const { filePath, fileName } = await imageResize.resize(
      createProjectImageDTOParameter.imageFile.buffer,
    );

    await b2.uploadFile(filePath, fileName);

    const projectImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(createProjectImageDTOParameter)),
      createProjectImageDTOParameter,
      {
        path: fileName,
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

    const { path } = projectImageDTOParameter;

    if (path) {
      const b2 = new Backblaze();
      await b2.authorize();
      await b2.removeFile(path);
    }
  } catch (err) {
    throw err;
  }
};
