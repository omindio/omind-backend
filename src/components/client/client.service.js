import urlSlug from 'url-slug';
import sgMail from '@sendgrid/mail';
import appRoot from 'app-root-path';
import fs from 'fs';

import ClientDTO from './client.dto';
import * as ClientDAL from './client.dal';
import * as ClientValidation from './validation/client.validation';

import { ImageResize } from '@libraries';
import { config } from '@config';
import { Service as UserService, DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { ClientAlreadyExistsError, ClientNotFoundError } from './Error';

const imagePath = `${appRoot}/uploads/images`;

export const create = async clientDTOParameter => {
  try {
    //parameter validation
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //run validation. Returns exceptions if fails
    await ClientValidation.createClientSchema.validate(clientDTOParameter);

    //generate slug
    const newData = {
      slug: urlSlug(clientDTOParameter.companyName),
    };

    //Check if exists some user with slug/company name received
    const clientDTOResult = await ClientDAL.getOne({ slug: newData.slug });
    if (clientDTOResult) throw new ClientAlreadyExistsError();

    //set client Role
    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(clientDTOParameter.user)),
      clientDTOParameter.user,
      { role: Role.Client },
    );

    //TODO: Remove this to set password in client.
    const plainPassword = userDTO.password;

    //validate user credentials and create
    return UserService.create(userDTO)
      .then(async ({ user, verificationToken }) => {
        newData.user = user.id;

        if (clientDTOParameter.logoFile) {
          const fileUpload = new ImageResize(imagePath);
          const filename = await fileUpload.save(clientDTOParameter.logoFile.buffer);

          newData.logo = filename;
        }

        const clientDTO = Object.assign(
          Object.create(Object.getPrototypeOf(clientDTOParameter)),
          clientDTOParameter,
          newData,
        );
        const client = await ClientDAL.create(clientDTO);

        _sendEmailAfterCreate(userDTO.email, plainPassword)
          .then()
          .catch(err => console.log(err));

        return {
          client: Object.assign(Object.create(Object.getPrototypeOf(client)), client, { user }),
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

export const update = async clientDTOParameter => {
  try {
    //parameter validation
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    //run validation. Returns exceptions if fails
    await ClientValidation.updateClientSchema.validate(clientDTOParameter);
    const clientDTOResult = await ClientDAL.getOneById(clientDTOParameter.id);
    if (!clientDTOResult) throw new ClientNotFoundError();

    const newData = {};

    if (clientDTOParameter.companyName.trim() != clientDTOResult.companyName.trim()) {
      newData.slug = urlSlug(clientDTOParameter.companyName);
      //Check if exists some user with slug/company name received
      const clientDTOSlugResult = await ClientDAL.getOne({ slug: newData.slug });
      if (clientDTOSlugResult) throw new ClientAlreadyExistsError();
    }

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(clientDTOParameter.user)),
      clientDTOParameter.user,
      { id: clientDTOResult.user.id },
    );

    return UserService.update(userDTO)
      .then(async () => {
        if (clientDTOParameter.logoFile) {
          if (clientDTOResult.logo) {
            fs.unlink(`${imagePath}/${clientDTOResult.logo}`, err => {
              if (err) throw err;
            });
          }

          const fileUpload = new ImageResize(imagePath);
          const filename = await fileUpload.save(clientDTOParameter.logoFile.buffer);

          newData.logo = filename;
        }

        newData.user = userDTO.id;

        const clientDTO = Object.assign(
          Object.create(Object.getPrototypeOf(clientDTOParameter)),
          clientDTOParameter,
          newData,
        );

        const client = await ClientDAL.update(clientDTO);

        return client;
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
    await ClientValidation.removeClientSchema.validate(clientDTOParameter);

    const clientDTOResult = await ClientDAL.getOneById(clientDTOParameter.id);
    if (!clientDTOResult) throw new ClientNotFoundError();

    if (clientDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    const userDTO = new UserDTO({ id: clientDTOResult.user.id });

    await ClientDAL.remove(clientDTOResult);
    await UserService.remove(userDTO);

    if (clientDTOResult.logo) {
      fs.unlink(`${imagePath}/${clientDTOResult.logo}`, err => {
        if (err) throw err;
      });
    }
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

    if (!clientDTOResult) throw new ClientNotFoundError();

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
    sgMail.setApiKey(config.sendgridApiKey);
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
