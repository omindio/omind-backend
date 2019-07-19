import BankAccountDTO from './bankAccount.dto';
import * as BankAccountDAL from './bankAccount.dal';
import * as BankAccountValidation from './validation/bankAccount.validation';

import { Service as UserService, DTO as UserDTO } from '@components/user';
import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { BankAccountNotFoundError, BankAccountAlreadyExistsError } from './Error';

export const create = async (userDTOParameter, bankAccountDTOParameter) => {
  try {
    //parameter validation
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //run validation. Returns exceptions if fails
    await BankAccountValidation.createBankAccountSchema.validate(bankAccountDTOParameter);

    //check if exists user (if no exists throw exception)
    await UserService.getOne(userDTOParameter);

    //check if exists bank account associated to user
    const bankAccountDTOResult = await getOneByUserId(userDTOParameter);

    if (bankAccountDTOResult) throw new BankAccountAlreadyExistsError();

    const bankAccountDTO = Object.assign(
      Object.create(Object.getPrototypeOf(bankAccountDTOParameter)),
      bankAccountDTOParameter,
      { user: userDTOParameter.id },
    );

    const bankAccount = await BankAccountDAL.create(bankAccountDTO);
    return bankAccount;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async (bankAccountDTOParameter, userRequestDTOParameter = null) => {
  try {
    //parameter validation
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //run validation. Returns exceptions if fails
    await BankAccountValidation.updateBankAccountSchema.validate(bankAccountDTOParameter);

    const BankAccountDTOResult = await BankAccountDAL.getOneById(bankAccountDTOParameter.id);
    if (!BankAccountDTOResult.id) throw new BankAccountNotFoundError();

    //check if request user is the owner of bank account
    if (userRequestDTOParameter.user != userDTOParameter.id)
      throw new UnauthorizedActionError('You can not edit this bank account.');

    const bankAccountDTO = await BankAccountDAL.update(bankAccountDTOParameter);
    return bankAccountDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async bankAccountDTOParameter => {
  try {
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //validate
    await BankAccountValidation.updateBankAccountSchema.validate(bankAccountDTOParameter);

    let BankAccountDTOResult = await BankAccountDAL.getOneById(bankAccountDTOParameter.id);
    if (!BankAccountDTOResult.id) throw new BankAccountNotFoundError();

    if (BankAccountDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    return UserService.removeById(BankAccountDTOResult.user.id)
      .then(async () => {
        await BankAccountDAL.remove(BankAccountDTOResult);
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOne = async bankAccountDTOParameter => {
  try {
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //validate
    await BankAccountValidation.getBankAccountSchema.validate(bankAccountDTOParameter);

    const BankAccountDTOResult = await BankAccountDAL.getOneById(bankAccountDTOParameter.id);

    if (!BankAccountDTOResult.id) throw new BankAccountNotFoundError();

    //returns DTO without password
    return BankAccountDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOneByUserId = async userDTOParameter => {
  try {
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    const BankAccountDTOResult = await BankAccountDAL.getOneByUserId(userDTOParameter.id);

    // if (!BankAccountDTOResult.id) throw new EmployeeNotFoundError();

    //returns DTO without password
    return BankAccountDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await BankAccountDAL.getAll({ password: undefined }, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      bankAccounts: result.bankAccounts,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
