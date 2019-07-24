//Data Access Layer
import _pickBy from 'lodash.pickby';
import ProjectModel from './project.model';
import ProjectDTO from './project.dto';

import { InstanceofError } from '@libraries/Error';
import { DTO as ClientDTO } from '@components/client';

export const getOne = async params => {
  try {
    const projectResult = await ProjectModel.findOne(params).populate('client');

    if (projectResult) {
      const projectDTO = new ProjectDTO(projectResult);

      const project = Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, {
        client: _getClientDTO(projectResult.client),
      });

      return project;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const projectResult = await ProjectModel.findById(idParameter).populate('client');
    if (projectResult) {
      const projectDTO = new ProjectDTO(projectResult);

      const project = Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, {
        client: _getClientDTO(projectResult.client),
      });
      return project;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const projects = await ProjectModel.find({})
      .populate('client')
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await ProjectModel.countDocuments();
    const projectsDTOArray = [];
    projects.forEach(project => {
      const projectDTO = new ProjectDTO(project);
      projection.client = _getClientDTO(project.client);
      projectsDTOArray.push(
        Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, projection),
      );
    });
    return {
      projects: projectsDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async projectDTOParameter => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    const projectDTO = _pickBy(projectDTOParameter);
    const projectModel = new ProjectModel(projectDTO);
    const project = await projectModel.save();
    return new ProjectDTO(project);
  } catch (err) {
    throw err;
  }
};

export const update = async projectDTOParameter => {
  try {
    if (!(projectDTOParameter instanceof ProjectDTO))
      throw new InstanceofError('Param sent need to be an ProjectDTO.');

    const projectDTOClean = _pickBy(
      projectDTOParameter,
      v => v !== null && v !== undefined && v !== '',
    );
    const projectResult = await ProjectModel.findOneAndUpdate(
      { _id: projectDTOClean.id },
      projectDTOClean,
      {
        new: true,
      },
    ).populate('client');
    const projectDTO = new ProjectDTO(projectResult);
    const project = Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, {
      client: _getClientDTO(projectResult.client),
    });
    return project;
  } catch (err) {
    throw err;
  }
};

export const remove = async projectDTOParameter => {
  if (!(projectDTOParameter instanceof ProjectDTO))
    throw new InstanceofError('Param sent need to be an ProjectDTO.');

  try {
    await ProjectModel.findOneAndRemove({ _id: projectDTOParameter.id });
  } catch (err) {
    throw err;
  }
};

const _getClientDTO = client => {
  const clientDTO = new ClientDTO(client);
  return Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, {});
};
