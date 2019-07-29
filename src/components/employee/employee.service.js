import sgMail from '@sendgrid/mail';

import EmployeeDTO from './employee.dto';
import * as EmployeeDAL from './employee.dal';
import * as EmployeeValidation from './validation/employee.validation';

import { Service as UserService, DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import { config } from '@config';
import * as Pagination from '@libraries/pagination';

//Global errors
import { InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { EmployeeNotFoundError } from './Error';

export const create = async employeeDTOParameter => {
  try {
    //parameter validation
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    //run validation. Returns exceptions if fails
    await EmployeeValidation.createEmployeeSchema.validate(employeeDTOParameter);

    const newData = {};

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(employeeDTOParameter.user)),
      employeeDTOParameter.user,
      { role: Role.Employee },
    );

    //TODO: Remove this to set password in client.
    const plainPassword = userDTO.password;

    //validate user credentials and create
    return UserService.create(userDTO)
      .then(async ({ user, verificationToken }) => {
        newData.user = user.id;

        const employeeDTO = Object.assign(
          Object.create(Object.getPrototypeOf(employeeDTOParameter)),
          employeeDTOParameter,
          newData,
        );

        const employee = await EmployeeDAL.create(employeeDTO);

        _sendEmailAfterCreate(userDTO.email, plainPassword)
          .then()
          .catch(err => console.log(err));

        return {
          employee: Object.assign(Object.create(Object.getPrototypeOf(employee)), employee, {
            user,
          }),
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

export const update = async employeeDTOParameter => {
  try {
    //parameter validation
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    //run validation. Returns exceptions if fails
    await EmployeeValidation.updateEmployeeSchema.validate(employeeDTOParameter);

    const employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);
    if (!employeeDTOResult) throw new EmployeeNotFoundError();

    const newData = {};

    const userDTO = Object.assign(
      Object.create(Object.getPrototypeOf(employeeDTOParameter.user)),
      employeeDTOParameter.user,
      { id: employeeDTOResult.user.id },
    );

    return UserService.update(userDTO)
      .then(async () => {
        newData.user = userDTO.id;

        const employeeDTO = Object.assign(
          Object.create(Object.getPrototypeOf(employeeDTOParameter)),
          employeeDTOParameter,
          newData,
        );

        const employee = await EmployeeDAL.update(employeeDTO);

        return employee;
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const remove = async employeeDTOParameter => {
  try {
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');
    //validate
    await EmployeeValidation.removeEmployeeSchema.validate(employeeDTOParameter);

    const employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);
    if (!employeeDTOResult) throw new EmployeeNotFoundError();

    // if (employeeDTOResult.role === Role.Admin)
    // throw new UnauthorizedActionError('You can not remove this user.');

    const userDTO = new UserDTO({ id: employeeDTOResult.user.id });

    await EmployeeDAL.remove(employeeDTOResult);
    await UserService.remove(userDTO);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getOne = async employeeDTOParameter => {
  try {
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    //validate
    await EmployeeValidation.getEmployeeSchema.validate(employeeDTOParameter);

    //check if exists id and if not find by email
    const employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);

    if (!employeeDTOResult) throw new EmployeeNotFoundError();

    //returns DTO without password
    return employeeDTOResult;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const getAll = async (page, limit) => {
  try {
    //validate pagination params and return values
    const pagination = await Pagination.initialize(page, limit);
    const result = await EmployeeDAL.getAll({ password: undefined }, pagination);

    return {
      pages: Math.ceil(result.count / pagination.limit),
      current: pagination.page,
      employees: result.employees,
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
