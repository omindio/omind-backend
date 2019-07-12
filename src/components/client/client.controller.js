import * as ClientService from './client.service';
import ClientDTO from './client.dto';

import { DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

//TODO: Think about create DTO in Service
export const create = async (req, res, next) => {
  try {
    const clientDTO = new ClientDTO(req.body);
    const userDTO = new UserDTO(req.body);

    if (req.file) clientDTO.logoFile = req.file;
    if (req.file === undefined) clientDTO.logoFile = null;

    const client = await ClientService.create(userDTO, clientDTO);
    res.status(201).json(client);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && id != req.user.clientId)
      throw new UnauthorizedActionError('You can not update this client.');

    let clientDTO = new ClientDTO(req.body);
    const userDTO = new UserDTO(req.body);
    clientDTO.id = id;

    if (req.file) clientDTO.logoFile = req.file;
    if (req.file === undefined) clientDTO.logoFile = null;

    const client = await ClientService.update(userDTO, clientDTO);
    res.status(200).json(client);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) throw new MissingParameterError(['id']);
    const clientDTO = new ClientDTO({ id });
    await ClientService.remove(clientDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const id = req.params.id;
  const slug = req.params.slug;
  try {
    if (!id && !slug) throw new MissingParameterError(['id', 'slug']);

    //Check Owner of client.
    //TODO: Por ahora comprobaremos la propiedad en el update.
    // if (Role.Admin != req.user.role && id != req.user.clientId)
    // throw new UnauthorizedActionError('You can not get this client.');

    let clientDTO = new ClientDTO({ id, slug });

    let client = await ClientService.getOne(clientDTO);
    res.status(200).json(client);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    let page = req.params.page;
    let limit = req.params.limit;

    let users = await ClientService.getAll(page, limit);
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};
