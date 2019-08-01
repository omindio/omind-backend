//Data Access Layer
import _pickBy from 'lodash.pickby';
import ProjectModel from './project.model';
import ProjectDTO from './project.dto';
import { DTO as ProjectImageDTO } from './components/projectImage';

import { InstanceofError } from '@libraries/Error';
import { DTO as ClientDTO } from '@components/client';

export const getOne = async (params, excludeFields = {}) => {
  try {
    const projectResult = await ProjectModel.findOne(params).populate({
      path: 'client',
      select:
        '_id companyName slug description logo socialLinkedin socialFacebook socialInstagram web',
    });

    if (projectResult) {
      const projectDTO = new ProjectDTO(projectResult);

      const project = Object.assign(
        Object.create(Object.getPrototypeOf(projectDTO)),
        projectDTO,
        {
          client: _getClientDTO(projectResult.client),
          images: _getProjectImagesDTOArray(projectResult.images),
        },
        excludeFields,
      );

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
    const projectResult = await ProjectModel.findById(idParameter).populate({
      path: 'client',
      select:
        '_id companyName slug description logo socialLinkedin socialFacebook socialInstagram web',
    });
    if (projectResult) {
      const projectDTO = new ProjectDTO(projectResult);

      const project = Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, {
        client: _getClientDTO(projectResult.client),
        images: _getProjectImagesDTOArray(projectResult.images),
      });
      return project;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (excludeFields = {}, pagination, filter = {}) => {
  try {
    const projects = await ProjectModel.find(filter)
      .populate({
        path: 'client',
        select:
          '_id companyName slug description logo socialLinkedin socialFacebook socialInstagram web',
      })
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);

    const count = await ProjectModel.countDocuments();
    const projectsDTOArray = [];

    projects.forEach(project => {
      const projectDTO = new ProjectDTO(project);
      const client = _getClientDTO(project.client);
      const images = _getProjectImagesDTOArray(project.images);

      projectsDTOArray.push(
        Object.assign(
          Object.create(Object.getPrototypeOf(projectDTO)),
          projectDTO,
          { client, images },
          excludeFields,
        ),
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
    ).populate({
      path: 'client',
      select:
        '_id companyName slug description logo socialLinkedin socialFacebook socialInstagram web',
    });
    const projectDTO = new ProjectDTO(projectResult);
    const project = Object.assign(Object.create(Object.getPrototypeOf(projectDTO)), projectDTO, {
      client: _getClientDTO(projectResult.client),
      images: _getProjectImagesDTOArray(projectResult.images),
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

export const addImage = async (projectDTOParameter, projectImageDTOParameter) => {
  if (!(projectDTOParameter instanceof ProjectDTO))
    throw new InstanceofError('Param sent need to be an ProjectDTO.');

  if (!(projectImageDTOParameter instanceof ProjectImageDTO))
    throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

  try {
    const projectModel = await ProjectModel.findById(projectDTOParameter.id);

    if (projectModel) {
      projectModel.images.push(projectImageDTOParameter);
      const project = await projectModel.save();

      const projectDTO = Object.assign(
        Object.create(Object.getPrototypeOf(projectDTOParameter)),
        projectDTOParameter,
        project.toJSON(),
      );
      return projectDTO;
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const updateImage = async (projectDTOParameter, projectImageDTOParameter) => {
  if (!(projectDTOParameter instanceof ProjectDTO))
    throw new InstanceofError('Param sent need to be an ProjectDTO.');

  if (!(projectImageDTOParameter instanceof ProjectImageDTO))
    throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

  try {
    const projectModel = await ProjectModel.findById(projectDTOParameter.id);

    if (projectModel) {
      const image = projectModel.images.id(projectImageDTOParameter.id);
      if (!image) return null;

      image.set(projectImageDTOParameter);

      const project = await projectModel.save();

      const projectDTO = Object.assign(
        Object.create(Object.getPrototypeOf(projectDTOParameter)),
        projectDTOParameter,
        project.toJSON(),
      );

      return { projectDTO, projectImageDTO: _getProjectImageDTO(image) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export const removeImage = async (projectDTOParameter, projectImageDTOParameter) => {
  if (!(projectDTOParameter instanceof ProjectDTO))
    throw new InstanceofError('Param sent need to be an ProjectDTO.');

  if (!(projectImageDTOParameter instanceof ProjectImageDTO))
    throw new InstanceofError('Param sent need to be an ProjectImageDTO.');

  try {
    const projectModel = await ProjectModel.findById(projectDTOParameter.id);

    if (projectModel) {
      const image = projectModel.images.id(projectImageDTOParameter.id);
      if (!image) return null;

      projectModel.images.pull(projectImageDTOParameter.id);
      const project = await projectModel.save();
      const projectDTO = Object.assign(
        Object.create(Object.getPrototypeOf(projectDTOParameter)),
        projectDTOParameter,
        project.toJSON(),
      );
      return { projectDTO, projectImageDTORemoved: _getProjectImageDTO(image) };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const _getClientDTO = client => {
  const clientDTO = new ClientDTO(client);
  return Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, {});
};

const _getProjectImagesDTOArray = projectImagesArray => {
  const projectImagesDTOArray = [];

  projectImagesArray.forEach(projectImage => {
    const projectImageDTO = _getProjectImageDTO(projectImage);
    projectImagesDTOArray.push(
      Object.assign(Object.create(Object.getPrototypeOf(projectImageDTO)), projectImageDTO, {}),
    );
  });

  return projectImagesDTOArray;
};

const _getProjectImageDTO = projectImage => {
  const projectImageDTO = new ProjectImageDTO(projectImage);
  return Object.assign(Object.create(Object.getPrototypeOf(projectImageDTO)), projectImageDTO, {});
};
