import * as UserService from './user.service';
import UserDTO from './user.dto';
import { roles as Role } from './config';

import { Service as BankAccountService } from '@components/bankAccount';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;

    const userDTO = new UserDTO({ name, lastName, email, password });

    const user = await UserService.create(userDTO);
    res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && id != req.user.id)
      throw new UnauthorizedActionError('You can not update this user.');
    const { name, lastName, email, password, id } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const userDTO = new UserDTO({ name, lastName, email, password, id });

    const user = await UserService.update(userDTO);
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);

    const userDTO = new UserDTO({ id: idParameter });

    await UserService.remove(userDTO, true);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && idParameter != req.user.id)
      throw new UnauthorizedActionError('You can not get this user.');

    const userDTO = new UserDTO({ id: idParameter });

    const user = await UserService.getOne(userDTO);
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

export const getBankAccount = async (req, res, next) => {
  const userIdParameter = req.params.userId;
  try {
    if (!userIdParameter) throw new MissingParameterError(['userId']);
    if (Role.Admin != req.user.role && idParameter != req.user.id)
      throw new UnauthorizedActionError('You can not get bank account of this User.');
    const userDTO = new UserDTO({ id: userIdParameter });

    const bankAccountDTO = await BankAccountService.getOneByUserId(userDTO);

    res.status(200).json(bankAccountDTO);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const page = req.params.page;
    const limit = req.params.limit;

    const users = await UserService.getAll(page, limit);
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

export const confirmRegistration = async (req, res, next) => {
  try {
    const tokenParameter = req.params.token;
    if (!tokenParameter) throw new MissingParameterError(['token']);

    await UserService.confirmRegistration(tokenParameter);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const resetTokenRegistration = async (req, res, next) => {
  try {
    const emailParameter = req.params.email;
    if (!emailParameter) throw new MissingParameterError(['email']);

    const token = await UserService.resetTokenRegistration(emailParameter);
    res.status(200).json(token);
  } catch (err) {
    return next(err);
  }
};
