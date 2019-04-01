import bcrypt from 'bcryptjs';

import UserDTO from './user.dto';
import * as UserDAL from './user.dal';
import * as UserValidation from './validation/user.validation';

import { roles as Role } from './config/roles';

//Global errors
import { 
    UnauthorizedActionError,
    InstanceofError,
    ValidationSchemaError
} from '@libraries/error-handler';

//User errors
import {
    EmailAlreadyExistsError,
    UserNotFoundError
} from './errors';

const passwordSalt = 10;

export const create = (userDTOParameter) => {
    return new Promise((resolve, reject) => {
        if (!(userDTOParameter instanceof UserDTO))
            return reject(new InstanceofError('Param sent need to be an UserDTO.'));

        //validate dto        
        UserValidation.createUserSchema.validate(userDTOParameter)
            .then(() => {
                //find if exists user with this email
                UserDAL.findOneByEmail(userDTOParameter.email)
                    .then(({userDTO}) => {
                        //if exits user return error
                        if (userDTO._id) 
                            return reject(new EmailAlreadyExistsError());
                        //hash password
                        try {
                            let salt = bcrypt.genSaltSync(passwordSalt);
                            let hash = bcrypt.hashSync(userDTOParameter.password, salt);
                            userDTOParameter.password = hash;
                        } catch (err) {
                            return reject(err);
                        } 
                        //create user with Data access layer
                        UserDAL.create(userDTOParameter)
                            .then((userDTO) => {
                                //Return User DTO without Password.
                                let userDTOResult = Object.assign({}, userDTO, { 
                                    password: undefined
                                });
                                resolve(userDTOResult);
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

export const update = (userDTOParameter) => {
    return new Promise((resolve, reject) => {
        if (!(userDTOParameter instanceof UserDTO))
            return reject(new InstanceofError('Param sent need to be an UserDTO.'));

        UserValidation.updateUserSchema.validate(userDTOParameter)
            .then(() => {
                UserDAL.findOneById(userDTOParameter._id)
                    .then(({userDTO, userModel}) => {
                        if (!userDTO._id) 
                            return reject(new UserNotFoundError());

                        let newPassword = userDTOParameter.password;    
                        if (newPassword) {
                            try {
                                let salt = bcrypt.genSaltSync(passwordSalt);
                                let hash = bcrypt.hashSync(newPassword, salt);
                                userDTOParameter.password = hash;
                            } catch (err) {
                                return reject(err);
                            }
                        }    

                        UserDAL.update(userDTOParameter, userModel)
                            .then((userDTO) => {
                                //Return User DTO without Password.
                                let userDTOResult = Object.assign({}, userDTO, { 
                                    password: undefined
                                });
                                resolve(userDTOResult);
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

export const remove = (userDTOParameter) => {
    return new Promise((resolve, reject) => {

        if (!(userDTOParameter instanceof UserDTO))
            return reject(new InstanceofError('Param sent need to be an UserDTO.'));

        UserValidation.updateUserSchema.validate(userDTOParameter)
            .then(() => {
                UserDAL.findOneById(userDTOParameter._id)
                    .then(({userDTO, userModel}) => {
                        if (!userDTO._id)
                            return reject(new UserNotFoundError());

                        if (userDTO.role === Role.Admin) 
                            return reject(new UnauthorizedActionError('You can not remove this user.'));

                        UserDAL.remove(userDTO, userModel)
                            .then(() => {
                                resolve()
                            })
                            .catch(err => { 
                                return reject(err) 
                            });    
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

export const getOne = (userDTOParameter) => {
    return new Promise((resolve, reject) => {
        if (!(userDTOParameter instanceof UserDTO))
            return reject(new InstanceofError('Param sent need to be an UserDTO.'));

            UserValidation.updateUserSchema.validate(userDTOParameter)
            .then(() => {
                UserDAL.findOneById(userDTOParameter._id)
                    .then(({userDTO}) => {
                        if (!userDTO._id)
                            return reject(new UserNotFoundError());

                        resolve(userDTO)  
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

export const getAll = () => {
    return new Promise((resolve, reject) => {
        UserDAL.findAll({password: undefined})
            .then(usersDTOArray => {
                resolve(usersDTOArray)
            })
            .catch(err => { 
                return reject(err) 
            });
    });
}