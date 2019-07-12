import urlSlug from 'url-slug';
import sgMail from '@sendgrid/mail';
import appRoot from 'app-root-path';
import fs from 'fs';

import ClientDTO from './client.dto';
import * as ClientDAL from './client.dal';
import * as ClientValidation from './validation/client.validation';

import { ImageResize } from '@libraries';
import { Service as UserService } from '@components/user';
import { roles as Role } from '@components/user/config';

import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { ClientAlreadyExistsError, ClientNotFoundError } from './Error';

const imagePath = `${appRoot}/uploads/images`;

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
    //TODO: Remove this to set password in client.
    const plainPassword = userDTOParameter.password;

    //validate user credentials and create
    return UserService.create(userDTOParameter)
      .then(async ({ user, verificationToken }) => {
        clientDTOParameter.user = user.id;

        if (clientDTOParameter.logoFile) {
          const fileUpload = new ImageResize(imagePath);
          const filename = await fileUpload.save(clientDTOParameter.logoFile.buffer);

          clientDTOParameter.logo = filename;
        }

        const clientDTO = await ClientDAL.create(clientDTOParameter);

        _sendEmailAfterCreate(userDTOParameter.email, plainPassword)
          .then()
          .catch(err => console.log(err));

        return {
          client: clientDTO,
          user,
          verificationToken,
        };
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const update = async (userDTOParameter, clientDTOParameter) => {
  try {
    //parameter validation
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //run validation. Returns exceptions if fails
    await ClientValidation.updateClientSchema.validate(clientDTOParameter);

    let clientDTOResult = await ClientDAL.getOneById(clientDTOParameter.id);
    if (!clientDTOResult.id) throw new ClientNotFoundError();

    //if (clientDTOParameter.slug != clientDTOResult.slug) {
    if (clientDTOParameter.companyName.trim() != clientDTOResult.companyName.trim()) {
      clientDTOParameter.slug = urlSlug(clientDTOParameter.companyName);
      //Check if exists some user with slug/company name received
      let clientDTOResult = await ClientDAL.getOne({ slug: clientDTOParameter.slug });
      if (clientDTOResult.id) throw new ClientAlreadyExistsError();
    }

    userDTOParameter.id = clientDTOResult.user.id;

    return UserService.update(userDTOParameter)
      .then(async user => {
        if (clientDTOParameter.logoFile) {
          if (clientDTOResult.logo) {
            fs.unlink(`${imagePath}/${clientDTOResult.logo}`, err => {
              if (err) throw err;
            });
          }

          const fileUpload = new ImageResize(imagePath);
          const filename = await fileUpload.save(clientDTOParameter.logoFile.buffer);

          clientDTOParameter.logo = filename;
        }

        const clientDTO = await ClientDAL.update(clientDTOParameter);

        return {
          client: clientDTO,
          user,
        };
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async clientDTOParameter => {
  try {
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //validate
    await ClientValidation.updateClientSchema.validate(clientDTOParameter);

    let clientDTOResult = await ClientDAL.getOneById(clientDTOParameter.id);
    if (!clientDTOResult.id) throw new ClientNotFoundError();

    if (clientDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    return UserService.removeById(clientDTOResult.user.id)
      .then(async () => {
        await ClientDAL.remove(clientDTOResult);
        //remove image if exists
        if (clientDTOResult.logo) {
          fs.unlink(`${imagePath}/${clientDTOResult.logo}`, err => {
            if (err) throw err;
          });
        }
      })
      .catch(err => {
        throw err;
      });
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

const _sendEmailAfterCreate = async (email, plainPassword) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'noreply@omindbrand.com',
      subject: 'Email & Password to access Omind platform.',
      html: `
    <p><strong>Email:</strong> ${email}</p><p>
    <strong>Password:</strong> ${plainPassword}</p>
    <p><small>For security: Remember to change your password.</small></p>
    `,
    };
    sgMail.send(msg);
  } catch (err) {
    throw err;
  }
};
