//Data Access Layer
import _pickBy from 'lodash.pickby';
import UserModel from './user.model';
import UserDTO from './user.dto';

import { InstanceofError } from '@libraries/Error';

export const getOneByEmail = async emailParameter => {
  try {
    const user = await UserModel.findOne({ email: emailParameter });
    if (user) {
      return new UserDTO(user);
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const user = await UserModel.findById(idParameter);
    if (user) {
      return new UserDTO(user);
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (excludeFields = {}, pagination) => {
  try {
    const users = await UserModel.find({})
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await UserModel.countDocuments();
    const usersDTOArray = [];

    users.forEach(user => {
      const userDTO = new UserDTO(user);
      usersDTOArray.push(
        Object.assign(Object.create(Object.getPrototypeOf(userDTO)), userDTO, excludeFields),
      );
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
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

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
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    const userDTO = _pickBy(userDTOParameter, v => v !== null && v !== undefined && v !== '');
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
    if (!(userDTOParameter instanceof UserDTO))
      throw new InstanceofError('Param sent need to be an UserDTO.');

    await UserModel.findOneAndRemove({ _id: userDTOParameter.id });
  } catch (err) {
    throw err;
  }
};
