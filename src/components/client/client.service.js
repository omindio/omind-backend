import bcrypt from 'bcryptjs';
import urlSlug from 'url-slug';

import ClientDTO from './client.dto';
import * as ClientDAL from './client.dal';
import * as ClientValidation from './validation/client.validation';

import { Role, Service as ClientService } from '@components/user';
console.log(Role);
import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { ClientAlreadyExistsError, ClientNotFoundError } from './Error';

const passwordSalt = 10;

/*
  TODO:
  - check slug if exists.
*/
export const create = async (userDTOParameter, clientDTOParameter) => {
  try {
    //parameter validation
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //run validation. Returns exceptions if fails
    await ClientValidation.createClientSchema.validate(clientDTOParameter);

    //generate slug
    clientDTOParameter.slug = urlSlug(clientDTOParameter.companyName);

    //Check if exists some user with slug/company name received
    let clientDTOResult = await ClientDAL.getOne({ slug: clientDTOParameter.slug });
    if (clientDTOResult.id) throw new ClientAlreadyExistsError();

    //set client Role
    userDTOParameter.role = Role.Client;

    //validate user credentials and create
    return ClientService.create(userDTOParameter)
      .then(async ({ user, verificationToken }) => {
        clientDTOParameter.user = user.id;

        let clientDTO = await ClientDAL.create(clientDTOParameter);

        return {
          client: clientDTO,
          user,
          verificationToken,
        };
      })
      .catch(err => {
        throw err;
      });

    //Check if exists some user with Email received
    // let userDTOResult = await ClientDAL.getOneByEmail(userDTOParameter.email);
    // if (userDTOResult.id) throw new EmailAlreadyExistsError();

    //hash and save password
    // let salt = await bcrypt.genSalt(passwordSalt);
    // let hash = await bcrypt.hash(userDTOParameter.password, salt);
    // userDTOParameter.password = hash;

    //call to DAL for save User & returns DTO without password

    //Create Token if user is not verified
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async userDTOParameter => {
  try {
    //parameter validation
    if (!(userDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //run validation. Returns exceptions if fails
    await ClientValidation.updateUserSchema.validate(userDTOParameter);

    let userDTOResult = await ClientDAL.getOneById(userDTOParameter.id);
    if (!userDTOResult.id) throw new UserNotFoundError();

    //check if exists new email
    if (userDTOResult.email != userDTOParameter.email) {
      let checkUserDTOResult = await ClientDAL.getOneByEmail(userDTOParameter.email);
      if (checkUserDTOResult.id) throw new EmailAlreadyExistsError();
    }

    //if exists password hash and set New
    let newPassword = userDTOParameter.password;
    if (newPassword) {
      let isMatch = await bcrypt.compare(newPassword, userDTOResult.password);
      if (isMatch) throw new SamePasswordError();

      let salt = await bcrypt.genSalt(passwordSalt);
      let hash = await bcrypt.hash(newPassword, salt);
      userDTOParameter.password = hash;
    }

    //call to DAL for save User & returns DTO without password
    let userDTO = await ClientDAL.update(userDTOParameter);
    return Object.assign({}, userDTO, {
      password: undefined,
    });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async userDTOParameter => {
  try {
    if (!(userDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //validate
    await ClientValidation.updateUserSchema.validate(userDTOParameter);

    let userDTOResult = await ClientDAL.getOneById(userDTOParameter.id);
    if (!userDTOResult.id) throw new UserNotFoundError();

    if (userDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    await ClientDAL.remove(userDTOResult);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOne = async clientDTOParameter => {
  try {
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //validate
    await ClientValidation.getClientSchema.validate(clientDTOParameter);

    let clientDTOResult;
    //check if exists id and if not find by email
    if (clientDTOParameter.id) {
      clientDTOResult = await ClientDAL.getOneById(clientDTOParameter.id);
    } else {
      clientDTOResult = await ClientDAL.getOne({ slug: clientDTOParameter.slug });
    }

    if (!clientDTOResult.id) throw new ClientNotFoundError();

    //returns DTO without password
    return clientDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    let pagination = await Pagination.initialize(page, limit);
    let result = await ClientDAL.getAll({ password: undefined }, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      clients: result.clients,
    };
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
