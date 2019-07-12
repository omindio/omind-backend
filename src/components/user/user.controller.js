import * as UserService from './user.service';
import UserDTO from './user.dto';
import { roles as Role } from './config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

//TODO: Think about create DTO in Service
export const create = async (req, res, next) => {
  try {
    let userDTO = new UserDTO(req.body);

    let user = await UserService.create(userDTO);
    res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (!id) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && id != req.user.id)
      throw new UnauthorizedActionError('You can not update this user.');

    let userDTO = new UserDTO(req.body);
    userDTO.id = id;

    let user = await UserService.update(userDTO);
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (!id) throw new MissingParameterError(['id']);

    let userDTO = new UserDTO({ id: id });

    await UserService.remove(userDTO, true);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  let id = req.params.id;
  try {
    if (!id) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && id != req.user.id)
      throw new UnauthorizedActionError('You can not get this user.');

    let userDTO = new UserDTO({ id: id });

    let user = await UserService.getOne(userDTO);
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    let page = req.params.page;
    let limit = req.params.limit;

    let users = await UserService.getAll(page, limit);
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

export const confirmRegistration = async (req, res, next) => {
  try {
    let token = req.params.token;
    if (!token) throw new MissingParameterError(['token']);

    await UserService.confirmRegistration(token);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const resetTokenRegistration = async (req, res, next) => {
  try {
    let email = req.params.email;
    if (!email) throw new MissingParameterError(['email']);

    let token = await UserService.resetTokenRegistration(email);
    res.status(200).json(token);
  } catch (err) {
    return next(err);
  }
};
