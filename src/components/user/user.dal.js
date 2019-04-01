//Data Access Layer
import _pickBy from 'lodash.pickby';
import UserModel from './user.model';
import UserDTO from './user.dto';
/*
    TODO: 
    - For better abstraction don't use userModel Param.
    - We are using mongoose ORM think about use Mongo driver (native).
*/
export const findOneByEmail = async (emailParameter) => {
    try {
        let user = await UserModel.findOne({email: emailParameter});
        return {
            userDTO: new UserDTO(user),
            userModel: user
        }
    } catch (err) {
        throw err;
    }
};

export const findOneById = async (idParameter) => {
    try {
        let user = await UserModel.findById(idParameter);
        return {
            userDTO: new UserDTO(user),
            userModel: user   
        }
    } catch (err) {
        throw err;
    }
};

export const findAll = async (projection = {}) => {
    try {
        let users = await UserModel.find({});
        
        let usersDTOArray = [];
        users.forEach((user) => {
            let userDTO = new UserDTO(user);
            let userDTOResult = Object.assign({}, userDTO, projection);
            
            usersDTOArray.push(userDTOResult);
        });

        return usersDTOArray;
    } catch (err) {
        throw err;
    }
};

export const create = async (userDTOParameter) => {
    let userDTO = _pickBy(userDTOParameter);
    let userModel = new UserModel(userDTO);

    try {
        let user = await userModel.save();
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const update = async (userDTOParameter, userModelParameter) => {
    //removing undefined or null variables if exists
    let userDTO = _pickBy(userDTOParameter);
    let userModel = Object.assign(userModelParameter, userDTO);
    try {
        let user = await userModel.save();
        return new UserDTO(user);
    } catch (err) {
        throw err;
    }
};

export const remove = async (userDTOParameter, userModel) => {
    try {
        await userModel.remove();
    } catch(err) {
        throw err;
    }
};
