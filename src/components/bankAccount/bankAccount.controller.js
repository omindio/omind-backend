import * as BankAccountService from './bankAccount.service';
import BankAccountDTO from './bankAccount.dto';

import { DTO as UserDTO } from '@components/user';

import { MissingParameterError } from '@libraries/Error';

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
    const userDTO = new UserDTO({ id: userIdParameter });

    const bankAccount = await BankAccountService.create(userDTO, bankAccountDTO);
    res.status(201).json(bankAccount);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);

    const { id, vat, swift, iban, routeNumber, bankName } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const bankAccountDTO = new BankAccountDTO({
      id,
      vat,
      swift,
      iban,
      routeNumber,
      bankName,
    });

    const userRequestDTO = new UserDTO({ id: req.user.id });

    const bankAccount = await BankAccountService.update(bankAccountDTO, userRequestDTO);
    res.status(200).json(bankAccount);
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

    const bankAccountDTO = new BankAccountDTO({ id: idParameter });
    const bankAccount = await BankAccountService.getOne(bankAccountDTO);
    res.status(200).json(bankAccount);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const bankAccounts = await BankAccountService.getAll(pageParameter, limitParameter);
    res.status(200).json(bankAccounts);
  } catch (err) {
    return next(err);
  }
};
