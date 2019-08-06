import * as ProjectService from './project.service';
import ProjectDTO from './project.dto';

import { DTO as ProjectImageDTO } from './components/projectImage';
import { DTO as ProjectVideoDTO } from './components/projectVideo';

import { DTO as ClientDTO } from '@components/client';
import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  try {
    const {
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      status,
      tags,
      employee,
      pmo,
      client,
    } = req.body;

    const tagsArray = tags ? tags.split(',') : [];

    const clientDTO = new ClientDTO({
      id: client,
    });

    const projectDTO = new ProjectDTO({
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      status,
      tags: tagsArray,
      employee,
      pmo,
      client: clientDTO,
    });

    const project = await ProjectService.create(projectDTO);
    res.status(201).json(project);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role)
      throw new UnauthorizedActionError('You can not update this project.');

    const {
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      published,
      status,
      tags,
      employee,
      pmo,
      client,
      id,
    } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const tagsArray = tags ? tags.split(',') : [];

    const clientDTO = new ClientDTO({
      id: client,
    });

    const projectDTO = new ProjectDTO({
      id,
      name,
      description,
      metaDescription,
      startedDate,
      finishedDate,
      published,
      status,
      tags: tagsArray,
      employee,
      pmo,
      client: clientDTO,
    });

    const project = await ProjectService.update(projectDTO);
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;

  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    const projectDTO = new ProjectDTO({ id: idParameter });
    await ProjectService.remove(projectDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);

    const projectDTO = new ProjectDTO({ id: idParameter });
    const project = await ProjectService.getOne(projectDTO);
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const projects = await ProjectService.getAll(pageParameter, limitParameter);
    res.status(200).json(projects);
  } catch (err) {
    return next(err);
  }
};

export const addVideo = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);

    const { title, source, url, published } = req.body;

    const projectVideoDTO = new ProjectVideoDTO({
      title,
      source,
      url,
      published: typeof published === 'string' ? published === 'true' : published,
    });
    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    const projectVideo = await ProjectService.addVideo(projectDTO, projectVideoDTO);

    res.status(201).json(projectVideo);
  } catch (err) {
    return next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  const videoIdParameter = req.params.videoId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);
    if (!videoIdParameter) throw new MissingParameterError(['videoId']);

    const { title, source, url, published } = req.body;

    const projectVideoDTO = new ProjectVideoDTO({
      id: videoIdParameter,
      title,
      source,
      url,
      published: typeof published === 'string' ? published === 'true' : published,
    });

    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    const projectVideo = await ProjectService.updateVideo(projectDTO, projectVideoDTO);

    res.status(201).json(projectVideo);
  } catch (err) {
    console.log(err);

    return next(err);
  }
};

export const removeVideo = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  const videoIdParameter = req.params.videoId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);
    if (!videoIdParameter) throw new MissingParameterError(['videoId']);

    const projectVideoDTO = new ProjectVideoDTO({ id: videoIdParameter });
    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    await ProjectService.removeVideo(projectDTO, projectVideoDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const addImage = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);

    const { title, main, coverPage, published } = req.body;

    let imageFile = req.file;
    if (imageFile === undefined) imageFile = null;

    const projectImageDTO = new ProjectImageDTO({
      title,
      main: typeof main === 'string' ? main === 'true' : main,
      coverPage: typeof coverPage === 'string' ? coverPage === 'true' : coverPage,
      published: typeof published === 'string' ? published === 'true' : published,
      imageFile,
    });

    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    const projectImage = await ProjectService.addImage(projectDTO, projectImageDTO);

    res.status(201).json(projectImage);
  } catch (err) {
    return next(err);
  }
};

export const updateImage = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  const imageIdParameter = req.params.imageId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);
    if (!imageIdParameter) throw new MissingParameterError(['imageId']);

    const { title, main, coverPage, published } = req.body;

    let imageFile = req.file;
    if (imageFile === undefined) imageFile = null;

    const projectImageDTO = new ProjectImageDTO({
      id: imageIdParameter,
      title,
      main: typeof main === 'string' ? main === 'true' : main,
      coverPage: typeof coverPage === 'string' ? coverPage === 'true' : coverPage,
      published: typeof published === 'string' ? published === 'true' : published,
      imageFile,
    });

    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    const projectImage = await ProjectService.updateImage(projectDTO, projectImageDTO);

    res.status(201).json(projectImage);
  } catch (err) {
    return next(err);
  }
};

export const removeImage = async (req, res, next) => {
  const projectIdParameter = req.params.projectId;
  const imageIdParameter = req.params.imageId;
  try {
    if (!projectIdParameter) throw new MissingParameterError(['projectId']);
    if (!imageIdParameter) throw new MissingParameterError(['imageId']);

    const projectImageDTO = new ProjectImageDTO({ id: imageIdParameter });
    const projectDTO = new ProjectDTO({ id: projectIdParameter });

    await ProjectService.removeImage(projectDTO, projectImageDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const publicGetAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const projects = await ProjectService.publicGetAll(pageParameter, limitParameter);
    res.status(200).json(projects);
  } catch (err) {
    return next(err);
  }
};

export const publicGetOne = async (req, res, next) => {
  const slugParameter = req.params.slug;
  try {
    if (!slugParameter) throw new MissingParameterError(['slug']);

    const projectDTO = new ProjectDTO({ slug: slugParameter });
    const project = await ProjectService.publicGetOne(projectDTO);
    res.status(200).json(project);
  } catch (err) {
    return next(err);
  }
};
