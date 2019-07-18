import * as BankAccountService from './employee.service';
import BankAccountDTO from './bankAccount.dto';

import { DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  const userIdParameter = req.params.userId;

  try {
    if (!userIdParameter) throw new MissingParameterError(['userId']);

    const { vat, swift, iban, routeNumber, bankName } = req.body;

    const bankAccountDTO = new BankAccountDTO({
      vat,
      swift,
      iban,
      routeNumber,
      bankName,
    });
    const userDTO = new UserDTO({ id: userId });

    const employee = await BankAccountService.create(userDTO, bankAccountDTO);
    res.status(201).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && idParameter != req.user.employeeId)
      throw new UnauthorizedActionError('You can not update this employee.');

    const {
      dni,
      lastName,
      socialInstagram,
      name,
      socialLinkedin,
      phone,
      socialFacebook,
      web,
      workPosition,
      fiscalAddress,
      password,
      email,
      id,
    } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const bankAccountDTO = new BankAccountDTO({
      dni,
      fiscalAddress,
      web,
      socialFacebook,
      workPosition,
      phone,
      socialLinkedin,
      socialInstagram,
      id,
    });
    const userDTO = new UserDTO({ name, lastName, email, password });

    const employee = await BankAccountService.update(userDTO, bankAccountDTO);
    res.status(200).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;

  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    const bankAccountDTO = new BankAccountDTO({ id: idParameter });
    await BankAccountService.remove(bankAccountDTO);
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

    const bankAccountDTO = new BankAccountDTO({ id: idParameter });
    const employee = await BankAccountService.getOne(bankAccountDTO);
    res.status(200).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const users = await BankAccountService.getAll(pageParameter, limitParameter);
    res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};
