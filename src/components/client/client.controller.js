import * as ClientService from './client.service';
import ClientDTO from './client.dto';
import { DTO as UserDTO, Role } from '@components/user';

import { MissingParametersError, UnauthorizedActionError } from '@libraries/Error';

//TODO: Think about create DTO in Service
export const create = async (req, res, next) => {
  try {
    let clientDTO = new ClientDTO(req.body);
    let userDTO = new UserDTO(req.body);

    let client = await ClientService.create(userDTO, clientDTO);
    res.status(201).json(client);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (!id) throw new MissingParametersError(['id']);
    if (Role.Admin != req.user.role && id != req.user.id)
      throw new UnauthorizedActionError('You can not update this client.');

    let clientDTO = new ClientDTO(req.body);
    clientDTO.id = id;

    let client = await ClientService.update(clientDTO);
    res.status(200).json(client);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (!id) throw new MissingParametersError(['id']);

    let clientDTO = new ClientDTO({ id: id });

    await ClientService.remove(clientDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const id = req.params.id;
  const slug = req.params.id;
  console.log(req.user);
  try {
    if (!id && !slug) throw new MissingParametersError(['id', 'slug']);

    //TODO: Check Owner of client.

    //if (Role.Admin != req.user.role && id != req.user.id)
    //throw new UnauthorizedActionError('You can not get this client.');

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
