import urlSlug from 'url-slug';

import ProjectDTO from './project.dto';
import * as ProjectDAL from './project.dal';
import * as ProjectValidation from './validation/project.validation';
import {
  DTO as ProjectImageDTO,
  Validation as ProjectImageValidation,
  Service as ProjectImageService,
} from './components/projectImage';
import {
  DTO as ProjectVideoDTO,
  Validation as ProjectVideoValidation,
} from './components/projectVideo';

import { Service as ClientService } from '@components/client';

import * as Pagination from '@libraries/pagination';

//Global errors
import { InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import {
  ProjectNotFoundError,
  ProjectAlreadyExistsError,
  ProjectIsPublishedError,
  MainImageAlreadyExistsError,
  CoverPageImageAlreadyExistsError,
} from './Error';

export const create = async projectDTOParameter => {
  try {
    //parameter validation
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    //run validation. Returns exceptions if fails
    await ProjectValidation.createProjectSchema.validate(projectDTOParameter);

    //Call to getOne Client
    await ClientService.getOne(projectDTOParameter.client);

    const newData = {
      slug: urlSlug(projectDTOParameter.name),
      client: projectDTOParameter.client.id,
    };

    //Check if exists some project with same name
    const projectDTOResult = await ProjectDAL.getOne({ slug: newData.slug });
    if (projectDTOResult) throw new ProjectAlreadyExistsError();

    //Check if date start is minor than date end --> DO IN VALIDATION
    // if (projectDTOParameter.startedDate > projectDTOParameter.finishedDate)
    // throw new ProjectInvalidDateError('Start date can not be greater than Finish.');

    const projectDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOParameter)),
      projectDTOParameter,
      newData,
    );

    const project = await ProjectDAL.create(projectDTO);

    return project;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async projectDTOParameter => {
  try {
    //parameter validation
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    await ProjectValidation.updateProjectSchema.validate(projectDTOParameter);

    const projectDTOResult = await ProjectDAL.getOneById(projectDTOParameter.id);
    if (!projectDTOResult) throw new ProjectNotFoundError();

    const newData = {
      client: projectDTOParameter.client.id,
    };

    //check if exists project
    if (projectDTOParameter.name.trim() != projectDTOResult.name.trim()) {
      newData.slug = urlSlug(projectDTOParameter.name);
      //Check if exists some user with slug/company name received
      const projectDTOSlugResult = await ProjectDAL.getOne({ slug: newData.slug });
      if (projectDTOSlugResult) throw new ProjectAlreadyExistsError();
    }

    //check client
    if (projectDTOParameter.client.id != projectDTOResult.client.id) {
      const clientDTOResult = await ClientService.getOne(projectDTOParameter.client);
      newData.client = clientDTOResult.id;
    }

    const projectDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOParameter)),
      projectDTOParameter,
      newData,
    );

    //If publish = true check if has main & cover page images.
    if (projectDTO.published) {
      const hasMainImage = await ProjectImageService.hasMainImage(projectDTOResult, false);
      if (hasMainImage)
        throw new MainImageAlreadyExistsError(
          'Can not publish project if does not exists main image.',
        );
      const hasCoverPage = await ProjectImageService.hasCoverPageImage(projectDTOResult, false);
      if (hasCoverPage)
        throw new CoverPageImageAlreadyExistsError(
          'Can not publish project if does not exists cover page image.',
        );
    }

    const project = await ProjectDAL.update(projectDTO);

    return project;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async projectDTOParameter => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');
    //validate
    await ProjectValidation.updateProjectSchema.validate(projectDTOParameter);

    const projectDTOResult = await ProjectDAL.getOneById(projectDTOParameter.id);
    if (!projectDTOResult) throw new ProjectNotFoundError();

    if (projectDTOResult.published) throw new ProjectIsPublishedError();

    await ProjectDAL.remove(projectDTOResult);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOne = async projectDTOParameter => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    //validate
    await ProjectValidation.getProjectSchema.validate(projectDTOParameter);

    //check if exists id and if not find by email
    const projectDTOResult = await ProjectDAL.getOneById(projectDTOParameter.id);

    if (!projectDTOResult) throw new ProjectNotFoundError();

    //returns DTO without password
    return projectDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await ProjectDAL.getAll({}, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      projects: result.projects,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const addImage = async (projectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    await ProjectImageValidation.createProjectImageSchema.validate(projectImageDTOParameter);

    //check get projectDTO and check if ...
    const projectDTOResult = await getOne(projectDTOParameter);

    //check if exist another main image - returns exception
    if (projectImageDTOParameter.main) await ProjectImageService.hasMainImage(projectDTOResult);

    //check if exist cover page - returns exception
    if (projectImageDTOParameter.coverPage)
      await ProjectImageService.hasCoverPageImage(projectDTOResult);

    const projectImageDTO = await ProjectImageService.saveFile(projectImageDTOParameter);
    const projectDTO = await ProjectDAL.addImage(projectDTOParameter, projectImageDTO);

    if (!projectDTO) throw new ProjectNotFoundError('Project or Image does not exists.');

    return projectDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

//TODO: Check another way to update. Current are changing IDs after update.
export const updateImage = async (projectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    await ProjectImageValidation.updateProjectImageSchema.validate(projectImageDTOParameter);

    const newData = {};

    const projectDTOResult = await getOne(projectDTOParameter);
    const indexImageDTOResult = await ProjectImageService.getOneById(
      projectDTOResult,
      projectImageDTOParameter,
    );

    if (!projectDTOResult.images[indexImageDTOResult].main && projectImageDTOParameter.main)
      await ProjectImageService.hasMainImage(projectDTOResult);

    if (
      !projectDTOResult.images[indexImageDTOResult].coverPage &&
      projectImageDTOParameter.coverPage
    )
      await ProjectImageService.hasCoverPageImage(projectDTOResult);

    //TODO: NO LLAMAR AUTENTICAR 2 VECES EN EL CDN.
    if (projectImageDTOParameter.imageFile) {
      //remove file
      const newProjectImageDTO = await ProjectImageService.updateFile(
        projectDTOResult.images[indexImageDTOResult],
        projectImageDTOParameter,
      );
      newData.path = newProjectImageDTO.path;
    }
    newData.title = projectImageDTOParameter.title;
    newData.imageFile = projectImageDTOParameter.imageFile;
    newData.main = projectImageDTOParameter.main;
    newData.coverPage = projectImageDTOParameter.coverPage;
    newData.published = projectImageDTOParameter.published;

    const projectImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOResult.images[indexImageDTOResult])),
      projectDTOResult.images[indexImageDTOResult],
      newData,
    );

    const updateImageResult = await ProjectDAL.updateImage(projectDTOParameter, projectImageDTO);

    if (!updateImageResult) throw new ProjectNotFoundError('Project or Image does not exists.');

    const { projectDTO } = updateImageResult;

    return { projectDTO, projectImageDTO };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const removeImage = async (projectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    await ProjectImageValidation.updateProjectImageSchema.validate(projectImageDTOParameter);

    const removeImageResult = await ProjectDAL.removeImage(
      projectDTOParameter,
      projectImageDTOParameter,
    );

    if (!removeImageResult) throw new ProjectNotFoundError('Project or Image does not exists.');

    const { projectDTO, projectImageDTORemoved } = removeImageResult;
    //Remove File by PATH.
    await ProjectImageService.removeFile(projectImageDTORemoved);

    return projectDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const addVideo = async (projectDTOParameter, projectVideoDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectVideoDTOParameter instanceof ProjectVideoDTO))
      throw new InstanceofError('Param sent need to be an ProjectVideoDTO.');

    await ProjectVideoValidation.createProjectVideoSchema.validate(projectVideoDTOParameter);

    const projectDTO = await ProjectDAL.addVideo(projectDTOParameter, projectVideoDTOParameter);

    if (!projectDTO) throw new ProjectNotFoundError('Project or Video does not exists.');

    return projectDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const updateVideo = async (projectDTOParameter, projectVideoDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectVideoDTOParameter instanceof ProjectVideoDTO))
      throw new InstanceofError('Param sent need to be an ProjectVideoDTO.');

    await ProjectVideoValidation.updateProjectVideoSchema.validate(projectVideoDTOParameter);

    const removeVideoResult = await ProjectDAL.updateVideo(
      projectDTOParameter,
      projectVideoDTOParameter,
    );

    if (!removeVideoResult) throw new ProjectNotFoundError('Project or Video does not exists.');

    const { projectDTO, projectVideoDTO } = removeVideoResult;

    return { projectDTO, projectVideoDTO };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const removeVideo = async (projectDTOParameter, projectVideoDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectVideoDTOParameter instanceof ProjectVideoDTO))
      throw new InstanceofError('Param sent need to be an ProjectVideoDTO.');

    await ProjectVideoValidation.updateProjectVideoSchema.validate(projectVideoDTOParameter);

    const removeVideoResult = await ProjectDAL.removeVideo(
      projectDTOParameter,
      projectVideoDTOParameter,
    );

    if (!removeVideoResult) throw new ProjectNotFoundError('Project or Video does not exists.');

    const { projectDTO } = removeVideoResult;

    return projectDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const publicGetOne = async projectDTOParameter => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    //validate
    await ProjectValidation.getPublicProjectSchema.validate(projectDTOParameter);

    //check if exists id and if not find by email
    const projectDTOResult = await ProjectDAL.getOne(
      {
        slug: projectDTOParameter.slug,
        published: true,
      },
      {
        createdDate: undefined,
        startedDate: undefined,
        finishedDate: undefined,
        status: undefined,
      },
    );

    if (!projectDTOResult) throw new ProjectNotFoundError();

    //returns DTO without password
    return projectDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const publicGetAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await ProjectDAL.getAll(
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
      projects: result.projects,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
