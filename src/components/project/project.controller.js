import * as ProjectService from './project.service';
import ProjectDTO from './project.dto';

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
      published,
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
      published,
      status,
      tags: tagsArray,
      employee,
      pmo,
      client: clientDTO,
    });

    const employeeResult = await ProjectService.create(projectDTO);
    res.status(201).json(employeeResult);
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

    // console.log(projectDTO);

    const project = await ProjectService.update(projectDTO);
    res.status(200).json(project);
  } catch (err) {
    console.log(err);
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

    //Check Owner of employee.
    //TODO: Por ahora comprobaremos la propiedad en el update.
    // if (Role.Admin != req.user.role && id != req.user.employeeId)
    // throw new UnauthorizedActionError('You can not get this employee.');

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
