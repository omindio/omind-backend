import bcrypt from 'bcryptjs';

import UserDTO from './user.dto';
import * as UserDAL from './user.dal';
import * as UserValidation from './validation/user.validation';

import { roles as Role } from './config';

import * as Pagination from '@libraries/pagination';
import { TokenService, TokenDTO, Type } from '@components/token';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
  SamePasswordError,
  UserVerifiedError,
} from './Error';

const passwordSalt = 10;

export const create = async userDTOParameter => {
  try {
    //parameter validation
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    //run validation. Returns exceptions if fails
    await UserValidation.createUserSchema.validate(userDTOParameter);

    //Check if exists some user with Email received
    const userDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
    if (userDTOResult.id) throw new EmailAlreadyExistsError();

    //hash and save password
    const salt = await bcrypt.genSalt(passwordSalt);
    const hash = await bcrypt.hash(userDTOParameter.password, salt);

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(userDTOParameter)),
      userDTOParameter,
      { password: hash },
    );

    //call to DAL for save User & returns DTO without password
    const user = await UserDAL.create(userDTO);

    //Create Token if user is not verified
    let tokenDTO = {};
    if (!user.isVerified) {
      tokenDTO = await TokenService.create(
        new TokenDTO({
          userId: user.id,
          type: Type.ConfirmRegistration,
        }),
      );
    }

    return {
      user: Object.assign(Object.create(Object.getPrototypeOf(user)), user, {
        password: undefined,
      }),
      verificationToken: tokenDTO,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async userDTOParameter => {
  try {
    //parameter validation
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    //run validation. Returns exceptions if fails
    await UserValidation.updateUserSchema.validate(userDTOParameter);

    const userDTOResult = await UserDAL.getOneById(userDTOParameter.id);
    if (!userDTOResult.id) throw new UserNotFoundError();

    //check if exists new email
    if (userDTOResult.email != userDTOParameter.email) {
      const checkUserDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
      if (checkUserDTOResult.id) throw new EmailAlreadyExistsError();
    }

    const newData = {};
    //if exists password hash and set New
    const newPassword = userDTOParameter.password;
    if (newPassword) {
      const isMatch = await bcrypt.compare(newPassword, userDTOResult.password);
      if (isMatch) throw new SamePasswordError();

      const salt = await bcrypt.genSalt(passwordSalt);
      const hash = await bcrypt.hash(newPassword, salt);

      newData.password = hash;
    }

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(userDTOParameter)),
      userDTOParameter,
      newData,
    );

    //call to DAL for save User & returns DTO without password
    const user = await UserDAL.update(userDTO);
    return Object.assign(Object.create(Object.getPrototypeOf(user)), user, {
      password: undefined,
    });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async (userDTOParameter, userAPI = false) => {
  try {
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    //validate
    await UserValidation.updateUserSchema.validate(userDTOParameter);

    let userDTOResult = await UserDAL.getOneById(userDTOParameter.id);
    if (!userDTOResult.id) throw new UserNotFoundError();

    if (userDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    if (userAPI && userDTOResult.role != 'User')
      throw new UnauthorizedActionError(
        `To delete ${userDTOResult.role} user use the correct API for the Role.`,
      );

    await UserDAL.remove(userDTOResult);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

//TODO: Check to add validations like default remove ^^
export const removeById = async userId => {
  try {
    const userDTO = new UserDTO({ id: userId });

    await remove(userDTO);
  } catch (err) {
    throw err;
  }
};

export const getOne = async userDTOParameter => {
  try {
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    //validate
    await UserValidation.getUserSchema.validate(userDTOParameter);

    let userDTOResult;
    //check if exists id and if not find by email
    if (userDTOParameter.id) {
      userDTOResult = await UserDAL.getOneById(userDTOParameter.id);
    } else {
      userDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
    }

    if (!userDTOResult.id) throw new UserNotFoundError();

    //returns DTO without password
    return Object.assign(Object.create(Object.getPrototypeOf(userDTOResult)), userDTOResult, {
      password: undefined,
    });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await UserDAL.getAll({ password: undefined }, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      users: result.users,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const confirmRegistration = async token => {
  try {
    const tokenDTO = new TokenDTO({ token: token });
    const tokenDTOResult = await TokenService.confirm(tokenDTO);

    const userDTO = await UserDAL.getOneById(tokenDTOResult.userId);
    const user = Object.assign(Object.create(Object.getPrototypeOf(userDTO)), userDTO, {
      isVerified: true,
    });

    await UserDAL.update(user);
  } catch (err) {
    throw err;
  }
};

export const resetTokenRegistration = async email => {
  try {
    const userDTO = new UserDTO({ email: email });
    const userDTOResult = await getOne(userDTO);

    if (userDTOResult.isVerified) throw new UserVerifiedError();

    const tokenDTO = new TokenDTO({ userId: userDTOResult.id });
    return await TokenService.reset(tokenDTO);
  } catch (err) {
    throw err;
  }
};
