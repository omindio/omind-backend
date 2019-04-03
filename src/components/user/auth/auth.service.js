import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { config } from '@config';

import AuthDTO from './auth.dto';
import * as UserDAL from '../user.dal';
import * as AuthValidation from './validation/auth.validation';

import { UnauthorizedAccessError } from './errors';
import { ValidationSchemaError } from '@libraries/error-handler';

export const auth = async (authDTOParameter) => {
    try {
        if (!(authDTOParameter instanceof AuthDTO))
            throw new InstanceofError('Param sent need to be an AuthDTO.');

        //validate email and password
        await AuthValidation.createAuthSchema.validate(authDTOParameter, {abortEarly: false});
        
        //check if exists User with Email sent
        const userDTOResult= await UserDAL.getOneByEmail(authDTOParameter.email);
        if (!userDTOResult._id)
            throw new UnauthorizedAccessError('User not found.');

        //Compare password sent with User found
        const isMatch = await bcrypt.compare(authDTOParameter.password, userDTOResult.password);
        if (isMatch) {
            const payload = {
                id: userDTOResult._id,
                name: userDTOResult.name,
                role: userDTOResult.role
            };
            return await jwt.sign(
                payload, 
                config.auth.secret, 
                { expiresIn: config.auth.tokenTime }
            );
        } else {
            throw new UnauthorizedAccessError('Wrong password.');
        }
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}