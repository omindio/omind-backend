import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { config } from '../../../config';
import { authLibrary } from '../../../libraries'; 

import User from './user.model';

//Auth dependency
const Role = authLibrary.roles;
//Excluding fields on find methods
const projection = {
    __v: false,
    password: false
};
const passwordSalt = 10;

export const create = (userData) => {
    return new Promise((resolve, reject) => {
        //TODO: VALIDATE DATA
        User.findOne({ email: userData.email })
            .then(user => {
                if (user)
                    return reject(new Error('Email already exists.'));

                const newUser = new User({
                    name: userData.name,
                    email: userData.email,
                    lastName: userData.lastName,
                    password: userData.password,
                    role: userData.role
                });

                bcrypt.genSalt(passwordSalt, (err, salt) => {
                    if (err) return reject(err);
    
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) return reject(err);
    
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                resolve(user);
                            })
                            .catch(err => reject(err));
                    });
                });
            })
            .catch(err => reject(err));
    });
}

export const update = (id, userData) => {
    return new Promise((resolve, reject) => {
        //TODO: VALIDATE DATA
        User.findById(id)
            .then(user => {
                if (!user) 
                    return reject(new Error('This user does not exists.'));
                
                user.name = userData.name;
                user.lastName = userData.lastName;
                user.role = userData.role;
                let newPassword = userData.password;
                if (newPassword) {
                    try {
                        let salt = bcrypt.genSaltSync(passwordSalt);
                        let hash = bcrypt.hashSync(newPassword, salt);
                    } catch (err) {
                        return reject(err);
                    }
                    user.password = hash;
                }
                user.save()
                    .then(user => {
                        resolve(user);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

export const remove = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .then(user => {
                if (!user) 
                    return reject(new Error('This user does not exists.'));
                if (user.role == Role.Admin) 
                    return reject(new Error('You can not delete Administrator.'));

                user.remove()
                    .then(() => {
                        resolve('User removed successfully.');
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

export const getOne = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id, projection)
        .then(user => {
            if (!user) 
                return reject(new Error('This user does not exists.'));
            
            resolve(user);
        })
        .catch(err => reject(err));
    });
}

export const getAll = () => {
    return new Promise((resolve, reject) => {
        User.find({}, projection)
        .then(users => {
            resolve(users);
        })
        .catch(err => reject(err));
    });
}

export const auth = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: userData.email})
            .then(user => {
                if (!user) 
                    return reject(new Error('Authentication failed. User not found.')); 

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
                            reject(new Error('Authentication failed. Wrong password.'));
                        }
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}