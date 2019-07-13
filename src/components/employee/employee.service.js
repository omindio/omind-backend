import sgMail from '@sendgrid/mail';

import EmployeeDTO from './employee.dto';
import * as EmployeeDAL from './employee.dal';
import * as EmployeeValidation from './validation/employee.validation';

import { Service as UserService } from '@components/user';
import { roles as Role } from '@components/user/config';

import * as Pagination from '@libraries/pagination';

//Global errors
import { UnauthorizedActionError, InstanceofError, ValidationSchemaError } from '@libraries/Error';
//User errors
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from './Error';

export const create = async (userDTOParameter, employeeDTOParameter) => {
  try {
    //parameter validation
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    //run validation. Returns exceptions if fails
    await EmployeeValidation.createEmployeeSchema.validate(employeeDTOParameter);

    //set employee Role
    userDTOParameter.role = Role.Employee;
    const plainPassword = userDTOParameter.password;

    //validate user credentials and create
    return UserService.create(userDTOParameter)
      .then(async ({ user, verificationToken }) => {
        employeeDTOParameter.user = user.id;

        const employeeDTO = await EmployeeDAL.create(employeeDTOParameter);

        _sendEmailAfterCreate(userDTOParameter.email, plainPassword)
          .then()
          .catch(err => console.log(err));

        return {
          employee: employeeDTO,
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

export const update = async (userDTOParameter, employeeDTOParameter) => {
  try {
    //parameter validation
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    //run validation. Returns exceptions if fails
    await EmployeeValidation.updateEmployeeSchema.validate(employeeDTOParameter);

    let employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);
    if (!employeeDTOResult.id) throw new EmployeeNotFoundError();

    //if (employeeDTOParameter.slug != employeeDTOResult.slug) {
    /*
    if (employeeDTOParameter.companyName.trim() != employeeDTOResult.companyName.trim()) {
      employeeDTOParameter.slug = urlSlug(employeeDTOParameter.companyName);
      //Check if exists some user with slug/company name received
      let employeeDTOResult = await EmployeeDAL.getOne({ slug: employeeDTOParameter.slug });
      if (employeeDTOResult.id) throw new EmployeeAlreadyExistsError();
    }
    */

    userDTOParameter.id = employeeDTOResult.user.id;

    return UserService.update(userDTOParameter)
      .then(async user => {
        if (employeeDTOParameter.logoFile) {
          if (employeeDTOResult.logo) {
            fs.unlink(`${imagePath}/${employeeDTOResult.logo}`, err => {
              if (err) throw err;
            });
          }

          const fileUpload = new ImageResize(imagePath);
          const filename = await fileUpload.save(employeeDTOParameter.logoFile.buffer);

          employeeDTOParameter.logo = filename;
        }

        const employeeDTO = await EmployeeDAL.update(employeeDTOParameter);

        return employeeDTO;
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
    await EmployeeValidation.updateEmployeeSchema.validate(employeeDTOParameter);

    let employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);
    if (!employeeDTOResult.id) throw new EmployeeNotFoundError();

    if (employeeDTOResult.role === Role.Admin)
      throw new UnauthorizedActionError('You can not remove this user.');

    /*
    return UserService.removeById(employeeDTOResult.user.id)
      .then(async () => {
        await EmployeeDAL.remove(employeeDTOResult);
        //remove image if exists
        if (employeeDTOResult.logo) {
          fs.unlink(`${imagePath}/${employeeDTOResult.logo}`, err => {
            if (err) throw err;
          });
        }
      })
      .catch(err => {
        throw err;
      });
    */
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

    let employeeDTOResult;
    //check if exists id and if not find by email
    if (employeeDTOParameter.id) {
      employeeDTOResult = await EmployeeDAL.getOneById(employeeDTOParameter.id);
    } else {
      employeeDTOResult = await EmployeeDAL.getOne({ slug: employeeDTOParameter.slug });
    }

    if (!employeeDTOResult.id) throw new EmployeeNotFoundError();

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
    let pagination = await Pagination.initialize(page, limit);
    let result = await EmployeeDAL.getAll({ password: undefined }, pagination);

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
