import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { config } from '@config';
import User from '../user.model';
import { UnauthorizedAccessError } from './errors';

export const auth = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: userData.email})
            .then(user => {
                if (!user)
                    return reject(new UnauthorizedAccessError('User not found.')); 

                bcrypt.compare(userData.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                role: user.role
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
                            reject(new UnauthorizedAccessError('Wrong password.'));
                        }
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}