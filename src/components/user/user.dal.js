//Data Access Layer
import _pickBy from 'lodash.pickby';
import UserModel from './user.model';
import UserDTO from './user.dto';

export const getOneByEmail = async emailParameter => {
  try {
    const user = await UserModel.findOne({ email: emailParameter });
    return new UserDTO(user);
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const user = await UserModel.findById(idParameter);
    return new UserDTO(user);
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const users = await UserModel.find({})
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await UserModel.countDocuments();
    const usersDTOArray = [];

    users.forEach(user => {
      let userDTO = new UserDTO(user);
      usersDTOArray.push(Object.assign({}, userDTO, projection));
    });
    return {
      users: usersDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async userDTOParameter => {
  try {
    const userDTO = _pickBy(userDTOParameter);
    const userModel = new UserModel(userDTO);
    const user = await userModel.save();
    return new UserDTO(user);
  } catch (err) {
    throw err;
  }
};

export const update = async userDTOParameter => {
  try {
    const userDTO = _pickBy(userDTOParameter);
    const user = await UserModel.findOneAndUpdate({ _id: userDTO.id }, userDTO, {
      new: true,
    });
    return new UserDTO(user);
  } catch (err) {
    throw err;
  }
};

export const remove = async userDTOParameter => {
  try {
    await UserModel.findOneAndRemove({ _id: userDTOParameter.id });
  } catch (err) {
    throw err;
  }
};
