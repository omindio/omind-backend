import urlSlug from 'url-slug';

import ProjectDTO from './project.dto';
import * as ProjectDAL from './project.dal';
import * as ProjectValidation from './validation/project.validation';

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

    //TODO: generate slug and check if exists.
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

    // console.log(project);
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
