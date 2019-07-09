//Data Access Layer
import _pickBy from 'lodash.pickby';
import ClientModel from './client.model';
import ClientDTO from './client.dto';

import { DTO as UserDTO } from '@components/user';

export const getOne = async params => {
  try {
    let client = await ClientModel.findOne(params).populate('user');
    let clientDTO = new ClientDTO(client);
    if (client && clientDTO.user) {
      clientDTO.user = _getUserDTO(client.user);
    }
    return clientDTO;
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const client = await ClientModel.findById(idParameter).populate('user');
    let clientDTO = new ClientDTO(client);
    if (client) clientDTO.user = _getUserDTO(client.user);
    return clientDTO;
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    let clients = await ClientModel.find({})
      .populate('user')
      .skip(pagination.skip)
      .limit(pagination.limit);
    let count = await ClientModel.countDocuments();
    let clientsDTOArray = [];
    clients.forEach(client => {
      let clientDTO = new ClientDTO(client);
      clientDTO.user = _getUserDTO(client.user);
      clientsDTOArray.push(Object.assign({}, clientDTO, projection));
    });
    return {
      clients: clientsDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async clientDTOParameter => {
  try {
    let clientDTO = _pickBy(clientDTOParameter);
    let userModel = new ClientModel(clientDTO);
    let client = await userModel.save();
    return new ClientDTO(client);
  } catch (err) {
    throw err;
  }
};
/*
let user = await User.create({ ... })
user = await user.populate('company').execPopulate()
*/
export const update = async clientDTOParameter => {
  try {
    let clientDTO = _pickBy(clientDTOParameter);
    let client = await ClientModel.findOneAndUpdate({ _id: clientDTO.id }, clientDTO, {
      new: true,
    });
    return new ClientDTO(client);
  } catch (err) {
    throw err;
  }
};

export const remove = async clientDTOParameter => {
  try {
    await ClientModel.findOneAndRemove({ _id: clientDTOParameter.id });
  } catch (err) {
    throw err;
  }
};

const _getUserDTO = user => {
  const userDTO = new UserDTO(user);
  return Object.assign({}, userDTO, { password: undefined });
};
