import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { config } from '@config';

import AuthDTO from './auth.dto';

import { DAL as UserDAL } from '@components/user';
import { roles as Role } from '@components/user/config';

import { DAL as ClientDAL } from '@components/client';
import { DAL as EmployeeDAL } from '@components/employee';
import * as AuthValidation from './validation/auth.validation';

import { UnauthorizedAccessError, UnverifiedUserError } from './Error';
import { ValidationSchemaError } from '@libraries/Error';

export const auth = async authDTOParameter => {
  try {
    if (!(authDTOParameter instanceof AuthDTO))
      throw new InstanceofError('Param sent need to be an AuthDTO.');

    //validate email and password
    await AuthValidation.createAuthSchema.validate(authDTOParameter, {
      abortEarly: false,
    });

    //check if exists User with Email sent
    const userDTOResult = await UserDAL.getOneByEmail(authDTOParameter.email);
    if (!userDTOResult.id) throw new UnauthorizedAccessError('User not found.');

    //Compare password sent with User found
    const isMatch = await bcrypt.compare(authDTOParameter.password, userDTOResult.password);

    if (!isMatch) throw new UnauthorizedAccessError('Wrong password.');
    if (!userDTOResult.isVerified) throw new UnverifiedUserError();

    const payload = {
      id: userDTOResult.id,
      name: userDTOResult.name,
      lastName: userDTOResult.lastName,
      email: userDTOResult.email,
      role: userDTOResult.role,
    };

    switch (userDTOResult.role) {
      case Role.Client:
        const clientDTO = await ClientDAL.getOne({ user: userDTOResult.id });
        payload.clientId = clientDTO.id;
        break;
      case Role.Employee:
        const employeeDTO = await EmployeeDAL.getOne({ user: userDTOResult.id });
        payload.employeeId = employeeDTO.id;
        break;
    }

    return await jwt.sign(payload, config.auth.secret, {
      expiresIn: config.auth.tokenTime,
    });
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
