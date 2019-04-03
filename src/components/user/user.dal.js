//Data Access Layer
import _pickBy from 'lodash.pickby';
import UserModel from './user.model';
import UserDTO from './user.dto';

export const getOneByEmail = async (emailParameter) => {
    try {
        let user = await UserModel.findOne({email: emailParameter});
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const getOneById = async (idParameter) => {
    try {
        let user = await UserModel.findById(idParameter);
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const getAll = async (projection = {}, pagination) => {
    try {
        let users = await UserModel.find({}).skip(pagination.skip).limit(pagination.limit);
        let count = await UserModel.countDocuments();
        let usersDTOArray = [];
        users.forEach((user) => {
            let userDTO = new UserDTO(user);
            let userDTOResult = Object.assign({}, userDTO, projection);
            
            usersDTOArray.push(userDTOResult);
        });
        return {
            users: usersDTOArray,
            count: count
        };
    } catch (err) {
        throw err;
    }
};

export const create = async (userDTOParameter) => {
    try {
        let userDTO = _pickBy(userDTOParameter);
        let userModel = new UserModel(userDTO);
        let user = await userModel.save();
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const update = async (userDTOParameter) => {
    try {
        let userDTO = _pickBy(userDTOParameter);
        let user = await UserModel.findOneAndUpdate({_id: userDTO._id}, userDTO, {new: true});
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const remove = async (userDTOParameter) => {
    try {
        await UserModel.findOneAndRemove({_id: userDTOParameter._id});
    } catch(err) {
        throw err;
    }
};
