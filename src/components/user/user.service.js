import bcrypt from 'bcryptjs';

import { roles as Role } from './config/roles';
import User from './user.model';

import { UnauthorizedActionError } from '@libraries/error-handler';
import {
    EmailAlreadyExistsError,
    UserNotFoundError
} from './errors';

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
                    return reject(new EmailAlreadyExistsError());

                const newUser = new User({
                    name: userData.name,
                    email: userData.email,
                    lastName: userData.lastName,
                    password: userData.password,
                });

                bcrypt.genSalt(passwordSalt, (err, salt) => {
                    if (err) return reject(err);
    
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) return reject(err);
    
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                resolve({
                                    _id: user._id,
                                    name: user.name,
                                    lastName: user.lastName,
                                    email: user.email,
                                    role: user.role,
                                    createdDate: user.createdDate
                                });
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
                    return reject(new UserNotFoundError());
                
                user.name = userData.name;
                user.lastName = userData.lastName;
                user.email = userData.email;
                let newPassword = userData.password;
                if (newPassword) {
                    try {
                        let salt = bcrypt.genSaltSync(passwordSalt);
                        let hash = bcrypt.hashSync(newPassword, salt);
                        user.password = hash;
                    } catch (err) {
                        return reject(err);
                    }
                }
                user.save()
                    .then(user => {
                        resolve({
                            _id: user._id,
                            name: user.name,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role,
                            createdDate: user.createdDate
                        });
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
                    return reject(new UserNotFoundError());
                if (user.role == Role.Admin) 
                    return reject(new UnauthorizedActionError('You can not remove this user.'));

                user.remove()
                    .then(() => {
                        resolve();
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
                return reject(new UserNotFoundError());
            
            resolve({
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                createdDate: user.createdDate
            });
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