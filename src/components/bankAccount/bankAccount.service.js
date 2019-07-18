import BankAccountDTO from './bankAccount.dto';
import * as BankAccountDAL from './bankAccount.dal';
import * as BankAccountValidation from './validation/bankAccount.validation';

import { Service as UserService, DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { EmployeeNotFoundError } from './Error';

export const create = async (userDTOParameter, BankAccountDTOParameter) => {
  try {
    //parameter validation
    if (!(BankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //run validation. Returns exceptions if fails
    await BankAccountValidation.createEmployeeSchema.validate(BankAccountDTOParameter);

    const newData = {};

    const BankAccountDTOResult = await getOneByUserId(userDTOParameter);

    if (BankAccountDTOResult) {
    }
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async (userDTOParameter, BankAccountDTOParameter) => {
  try {
    //parameter validation
    if (!(BankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //run validation. Returns exceptions if fails
    await BankAccountValidation.updateEmployeeSchema.validate(BankAccountDTOParameter);

    let BankAccountDTOResult = await BankAccountDAL.getOneById(BankAccountDTOParameter.id);
    if (!BankAccountDTOResult.id) throw new EmployeeNotFoundError();

    // const newData = {};

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(userDTOParameter)),
      userDTOParameter,
      { id: BankAccountDTOResult.user.id },
    );

    return UserService.update(userDTO)
      .then(async () => {
        const BankAccountDTO = await BankAccountDAL.update(BankAccountDTOParameter);

        return BankAccountDTO;
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async BankAccountDTOParameter => {
  try {
    if (!(BankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //validate
    await BankAccountValidation.updateEmployeeSchema.validate(BankAccountDTOParameter);

    let BankAccountDTOResult = await BankAccountDAL.getOneById(BankAccountDTOParameter.id);
    if (!BankAccountDTOResult.id) throw new EmployeeNotFoundError();

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

export const getOne = async BankAccountDTOParameter => {
  try {
    if (!(BankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    //validate
    await BankAccountValidation.getEmployeeSchema.validate(BankAccountDTOParameter);

    //let BankAccountDTOResult;
    //check if exists id and if not find by email
    //if (BankAccountDTOParameter.id) {
    const BankAccountDTOResult = await BankAccountDAL.getOneById(BankAccountDTOParameter.id);
    //} else {
    //BankAccountDTOResult = await BankAccountDAL.getOne({ slug: BankAccountDTOParameter.slug });
    //}

    if (!BankAccountDTOResult.id) throw new EmployeeNotFoundError();

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
