import urlSlug from 'url-slug';

import ProjectDTO from './project.dto';
import * as ProjectDAL from './project.dal';
import * as ProjectValidation from './validation/project.validation';
import {
  DTO as ProjectImageDTO,
  Validation as ProjectImageValidation,
  Service as ProjectImageService,
} from './components/projectImage';

import { Service as ClientService } from '@components/client';

import * as Pagination from '@libraries/pagination';

//Global errors
import { InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { ProjectNotFoundError, ProjectAlreadyExistsError, ProjectIsPublishedError } from './Error';

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

    //Check if date start is minor than date end --> DID IN VALIDATION
    // if (projectDTOParameter.startedDate > projectDTOParameter.finishedDate)
    // throw new ProjectInvalidDateError('Start date can not be greater than Finish.');

    const projectDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOParameter)),
      projectDTOParameter,
      newData,
    );

    const employee = await ProjectDAL.create(projectDTO);

    return employee;
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

    const employeeDTOResult = await ProjectDAL.getOneById(projectDTOParameter.id);
    if (!employeeDTOResult) throw new ProjectNotFoundError();

    if (employeeDTOResult.published) throw new ProjectIsPublishedError();

    await ProjectDAL.remove(employeeDTOResult);
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
    const employeeDTOResult = await ProjectDAL.getOneById(projectDTOParameter.id);

    if (!employeeDTOResult || !employeeDTOResult.id) throw new ProjectNotFoundError();

    //returns DTO without password
    return employeeDTOResult;
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

    const projectDTOResult = await getOne(projectDTOParameter);

    if (projectImageDTOParameter.main) await ProjectImageService.hasMainImage(projectDTOResult);
    if (projectImageDTOParameter.coverPage)
      await ProjectImageService.hasCoverPageImage(projectDTOResult);

    const projectImageDTO = await ProjectImageService.saveFile(projectImageDTOParameter);

    const projectDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOResult)),
      projectDTOResult,
      {
        images: projectDTOResult.images.concat([projectImageDTO]),
      },
    );

    const project = await update(projectDTO);

    return project;
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

    const projectDTOResult = await getOne(projectDTOParameter);

    const newData = {};

    const indexImageDTOResult = await ProjectImageService.getOneById(
      projectDTOResult,
      projectImageDTOParameter,
    );

    if (projectImageDTOParameter.main) await ProjectImageService.hasMainImage(projectDTOResult);
    if (projectImageDTOParameter.coverPage)
      await ProjectImageService.hasCoverPageImage(projectDTOResult);

    if (projectImageDTOParameter.imageFile) {
      //remove file
      await ProjectImageService.removeFile(projectDTOResult.images[indexImageDTOResult]);
      //save file
      const projectImageDTOSaved = await ProjectImageService.saveFile(projectImageDTOParameter);
      newData.path = projectImageDTOSaved.path;
    }

    const projectImageDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOResult.images[indexImageDTOResult])),
      projectDTOResult.images[indexImageDTOResult],
      projectImageDTOParameter,
      newData,
    );

    projectDTOResult.images[indexImageDTOResult] = projectImageDTO;

    const project = await update(projectDTOResult);
    return project;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

//TODO: Check another way to remove. Current are changing IDs after update.
export const removeImage = async (projectDTOParameter, projectImageDTOParameter) => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    if (!(projectImageDTOParameter instanceof ProjectImageDTO))
      throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

    await ProjectImageValidation.updateProjectImageSchema.validate(projectImageDTOParameter);

    const projectDTOResult = await getOne(projectDTOParameter);
    const { projectImageDTORemoved, projectImagesDTOArray } = await ProjectImageService.removeById(
      projectDTOResult,
      projectImageDTOParameter,
    );

    const projectDTO = Object.assign(
      Object.create(Object.getPrototypeOf(projectDTOResult)),
      projectDTOResult,
      {
        images: projectImagesDTOArray,
      },
    );

    const project = await update(projectDTO);
    await ProjectImageService.removeFile(projectImageDTORemoved);

    return project;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
