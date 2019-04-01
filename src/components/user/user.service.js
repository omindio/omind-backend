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

export const create = async (userDTOParameter) => {
    try {
        //parameter validation
        if (!(userDTOParameter instanceof UserDTO))
            throw new InstanceofError('Param sent need to be an UserDTO.');
        
        //run validation. Returns exceptions if fails
        await UserValidation.createUserSchema.validate(userDTOParameter);

        //Check if exists some user with Email received
        let { userDTO } = await UserDAL.findOneByEmail(userDTOParameter.email);
        if (userDTO._id) 
            throw new EmailAlreadyExistsError();

        //hash and save password
        let salt = await bcrypt.genSalt(passwordSalt);
        let hash = await bcrypt.hash(userDTOParameter.password, salt);
        userDTOParameter.password = hash;

        //call to DAL for save User & returns DTO without password
        userDTO = await UserDAL.create(userDTOParameter);
        return Object.assign({}, userDTO, { 
            password: undefined
        });
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}

export const update = async (userDTOParameter) => {
    try {
        //parameter validation
        if (!(userDTOParameter instanceof UserDTO))
            throw new InstanceofError('Param sent need to be an UserDTO.');

        //run validation. Returns exceptions if fails
        await UserValidation.updateUserSchema.validate(userDTOParameter);

        let { userDTO, userModel } = await UserDAL.findOneById(userDTOParameter._id);
        if (!userDTO._id) 
            throw new UserNotFoundError();

        //check if exists new email        
        if (userDTO.email != userDTOParameter.email) {
            //TODO: Better way to naming VAR.
            let { userDTO } = await UserDAL.findOneByEmail(userDTOParameter.email);
            if (userDTO._id) 
                throw new EmailAlreadyExistsError();
        }

        //if exists password hash and set New
        let newPassword = userDTOParameter.password;    
        if (newPassword) {
            let salt = await bcrypt.genSalt(passwordSalt);
            let hash = await bcrypt.hash(newPassword, salt);
            userDTOParameter.password = hash;
        }

        //TODO: Send email verification

        //call to DAL for save User & returns DTO without password
        userDTO = await UserDAL.update(userDTOParameter, userModel);
        return Object.assign({}, userDTO, { 
            password: undefined
        });
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}

export const remove = async (userDTOParameter) => {
    try {
        if (!(userDTOParameter instanceof UserDTO))
            throw new InstanceofError('Param sent need to be an UserDTO.');

        //validate
        await UserValidation.updateUserSchema.validate(userDTOParameter);

        let { userDTO, userModel } = await UserDAL.findOneById(userDTOParameter._id);
        if (!userDTO._id)
            throw new UserNotFoundError();

        if (userDTO.role === Role.Admin) 
            throw new UnauthorizedActionError('You can not remove this user.');

        await UserDAL.remove(userDTO, userModel);
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}

export const getOne = async (userDTOParameter) => {
    try {
        if (!(userDTOParameter instanceof UserDTO))
            throw new InstanceofError('Param sent need to be an UserDTO.');

        //validate
        await UserValidation.updateUserSchema.validate(userDTOParameter);

        let { userDTO } = await UserDAL.findOneById(userDTOParameter._id);
        if (!userDTO._id)
            throw new UserNotFoundError();

        //returns DTO without password
        return Object.assign({}, userDTO, { 
            password: undefined
        });
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}

export const getAll = async () => {
    try {
        return await UserDAL.findAll({password: undefined});
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}