import * as ClientService from './client.service';
import ClientDTO from './client.dto';

import { DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  try {
    const {
      cif,
      lastName,
      socialInstagram,
      companyName,
      name,
      socialLinkedin,
      phone,
      published,
      socialFacebook,
      web,
      fiscalAddress,
      password,
      email,
      description,
    } = req.body;

    let logoFile = req.file;
    if (logoFile === undefined) logoFile = null;

    const userDTO = new UserDTO({ name, lastName, email, password });

    const clientDTO = new ClientDTO({
      companyName,
      cif,
      fiscalAddress,
      description,
      web,
      socialFacebook,
      published,
      phone,
      socialLinkedin,
      socialInstagram,
      logoFile,
      user: userDTO,
    });

    const client = await ClientService.create(clientDTO);
    res.status(201).json(client);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && idParameter != req.user.clientId)
      throw new UnauthorizedActionError('You can not update this client.');
    
    const {
      cif,
      lastName,
      socialInstagram,
      companyName,
      name,
      socialLinkedin,
      phone,
      published,
      socialFacebook,
      web,
      fiscalAddress,
      password,
      email,
      description,
      id,
    } = Object.assign({}, req.body, {
      id: idParameter,
    });

    let logoFile = req.file;
    if (logoFile === undefined) logoFile = null;

    const userDTO = new UserDTO({ name, lastName, email, password });

    const clientDTO = new ClientDTO({
      companyName,
      cif,
      fiscalAddress,
      description,
      web,
      socialFacebook,
      published,
      phone,
      socialLinkedin,
      socialInstagram,
      logoFile,
      id,
      user: userDTO,
    });

    const client = await ClientService.update(clientDTO);
    res.status(200).json(client);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;

  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    const clientDTO = new ClientDTO({ id: idParameter });
    await ClientService.remove(clientDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const idParameter = req.params.id;
  const slugParameter = req.params.slug;
  try {
    if (!idParameter && !slugParameter) throw new MissingParameterError(['id', 'slug']);

    //Check Owner of client.
    //TODO: Por ahora comprobaremos la propiedad en el update.
    // if (Role.Admin != req.user.role && id != req.user.clientId)
    // throw new UnauthorizedActionError('You can not get this client.');

    const clientDTO = new ClientDTO({ id: idParameter, slug: slugParameter });

    const client = await ClientService.getOne(clientDTO);
    res.status(200).json(client);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const clients = await ClientService.getAll(pageParameter, limitParameter);
    res.status(200).json(clients);
  } catch (err) {
    return next(err);
  }
};
