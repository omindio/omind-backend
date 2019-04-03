import bcrypt from 'bcryptjs';

import UserDTO from './user.dto';
import * as UserDAL from './user.dal';
import * as UserValidation from './validation/user.validation';

import { roles as Role } from './config/roles';

import * as Pagination from '@libraries/pagination';

//Global errors
import { 
    UnauthorizedActionError,
    InstanceofError,
    ValidationSchemaError
} from '@libraries/error-handler';

//User errors
import {
    EmailAlreadyExistsError,
    UserNotFoundError,
    SamePasswordError
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
        let userDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
        if (userDTOResult._id) 
            throw new EmailAlreadyExistsError();

        //hash and save password
        let salt = await bcrypt.genSalt(passwordSalt);
        let hash = await bcrypt.hash(userDTOParameter.password, salt);
        userDTOParameter.password = hash;

        //call to DAL for save User & returns DTO without password
        let userDTO = await UserDAL.create(userDTOParameter);
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

        let userDTOResult = await UserDAL.getOneById(userDTOParameter._id);
        if (!userDTOResult._id) 
            throw new UserNotFoundError();

        //check if exists new email        
        if (userDTOResult.email != userDTOParameter.email) {
            userDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
            if (userDTOResult._id) 
                throw new EmailAlreadyExistsError();
        }

        //if exists password hash and set New
        let newPassword = userDTOParameter.password;    
        if (newPassword) {
            let isMatch = await bcrypt.compare(newPassword, userDTOResult.password);
            if (isMatch)
                throw new SamePasswordError();

            let salt = await bcrypt.genSalt(passwordSalt);
            let hash = await bcrypt.hash(newPassword, salt);
            userDTOParameter.password = hash;
        }

        //TODO: Send email verification

        //call to DAL for save User & returns DTO without password
        let userDTO = await UserDAL.update(userDTOParameter);
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

        let userDTOResult = await UserDAL.getOneById(userDTOParameter._id);
        if (!userDTOResult._id)
            throw new UserNotFoundError();

        if (userDTOResult.role === Role.Admin) 
            throw new UnauthorizedActionError('You can not remove this user.');

        await UserDAL.remove(userDTOResult);
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

        let userDTOResult;
        //check if exists id and if not find by email
        if (userDTOParameter._id) {
            userDTOResult = await UserDAL.getOneById(userDTOParameter._id);
        } else {
            userDTOResult = await UserDAL.getOneByEmail(userDTOParameter.email);
        }

        if (!userDTOResult._id)
            throw new UserNotFoundError();

        //returns DTO without password
        return Object.assign({}, userDTOResult, { 
            password: undefined
        });
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}

export const getAll = async (page, limit) => {
    try {
        let pagination = Pagination.initialize(page, limit);
        let result = await UserDAL.getAll({password: undefined}, pagination);
        
        return {
            pages: Math.ceil(result.count / limit),
            current: page,
            users: result.users,
        }
    } catch (err) {
        if (err.hasOwnProperty('details'))
            throw new ValidationSchemaError(err);
        else
            throw err;
    }
}