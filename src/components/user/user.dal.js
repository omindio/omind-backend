//Data Access Layer
import _pickBy from 'lodash.pickby';
import UserModel from './user.model';
import UserDTO from './user.dto';
/*
    TODO: 
        - For better abstraction don't use userModel Param.
        - We are using mongoose ORM think about use Mongo driver (native).
*/
//TODO: ADD PROJECTION IN FUNCTION PARAMETER TO EXCLUDE FIELDS IF IT IS NECESARY.
export const findOneByEmail = (emailParameter) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: emailParameter })
            .then(user => {
                resolve({ userDTO: new UserDTO(user), userModel: user });
            })
            .catch(err => {
                return reject(err)
            });
    });
};

//TODO:
export const findOneById = (idParameter) => {
    return new Promise((resolve, reject) => {
        UserModel.findById(idParameter)
            .then(user => {
                resolve({ userDTO: new UserDTO(user), userModel: user });
            })
            .catch(err => {
                return reject(err)
            });
    });    
};

//TODO:
export const findAll = (projection = {}) => {
    return new Promise((resolve, reject) => {
        UserModel.find({})
        .then(users => {
            let usersDTOArray = [];
            users.forEach((user) => {
                let userDTO = new UserDTO(user);
                let userDTOResult = Object.assign({}, userDTO, projection);
                usersDTOArray.push(userDTOResult);
            });
            resolve(usersDTOArray);
        })
        .catch(err => reject(err));
    });
};

export const create = (userDTOParameter) => {
    return new Promise((resolve, reject) => {
        //removing undefined or null variables if exists
        let userDTO = _pickBy(userDTOParameter);
        let userModel = new UserModel(userDTO);

        userModel.save()
            .then(user => {
                resolve(new UserDTO(user))
            })
            .catch(err => {
                return reject(err)
            });
    });
};

export const update = (userDTOParameter, userModelParameter) => {
    return new Promise((resolve, reject) => {
        //removing undefined or null variables if exists
        let userDTO = _pickBy(userDTOParameter);
        let userModel = Object.assign(userModelParameter, userDTO);

        userModel.save()
            .then(user => {
                resolve(new UserDTO(user));
            })
            .catch(err => {
                return reject(err);
            });
    });
};

//TODO:
export const remove = (userDTOParameter, userModel) => {
    return new Promise((resolve, reject) => {
        userModel.remove((err, user) => {
            if (err)
                return reject(err);
            resolve();
        }); 
    });
};
