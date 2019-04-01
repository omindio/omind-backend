import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { config } from '@config';

import AuthDTO from './auth.dto';
import * as UserDAL from '../user.dal';
import * as AuthValidation from './validation/auth.validation';

import { UnauthorizedAccessError } from './errors';
import { ValidationSchemaError } from '@libraries/error-handler';

export const auth = (authDTOParameter) => {
    return new Promise((resolve, reject) => {
        if (!(authDTOParameter instanceof AuthDTO))
            return reject(new InstanceofError('Param sent need to be an AuthDTO.'));

        AuthValidation.createAuthSchema.validate(authDTOParameter, {abortEarly: false})
            .then(() => {
                UserDAL.findOneByEmail(authDTOParameter.email)
                    .then(({userDTO}) => {
                        if (!userDTO._id)
                            return reject(new UnauthorizedAccessError('User not found.')); 
                    
                        bcrypt.compare(authDTOParameter.password, userDTO.password)
                            .then(isMatch => {
                                if (isMatch) {
                                    const payload = {
                                        id: userDTO._id,
                                        name: userDTO.name,
                                        role: userDTO.role
                                    };
                                    jwt.sign(
                                        payload, 
                                        config.auth.secret, 
                                        { expiresIn: config.auth.tokenTime },
                                        (err, token) => {
                                            if (err) return reject(err);
                                            resolve(token);
                                        }
                                    );
                                } else {
                                    return reject(new UnauthorizedAccessError('Wrong password.'));
                                }
                            })
                            .catch(err => { 
                                return reject(err) 
                            });
                    })
                    .catch(err => { 
                        return reject(err) 
                    });
            })
            .catch(err => { 
                if (err.hasOwnProperty('details')) {
                    return reject(new ValidationSchemaError(err));
                } else {
                    return reject(err);
                }
            });
    });
}