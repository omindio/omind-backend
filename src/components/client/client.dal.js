//Data Access Layer
import _pickBy from 'lodash.pickby';
import ClientModel from './client.model';
import ClientDTO from './client.dto';

import { DTO as UserDTO } from '@components/user';
import { InstanceofError } from '@libraries/Error';

export const getOne = async params => {
  try {
    const clientResult = await ClientModel.findOne(params).populate('user');
    const clientDTO = new ClientDTO(clientResult);
    if (clientResult && clientDTO.user) {
      const client = Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, {
        user: _getUserDTO(clientResult.user),
      });
      return client;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const clientResult = await ClientModel.findById(idParameter).populate('user');
    const clientDTO = new ClientDTO(clientResult);
    if (clientResult) {
      const client = Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, {
        user: _getUserDTO(clientResult.user),
      });
      return client;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const clients = await ClientModel.find({})
      .sort({ createdDate: 'desc' })
      .populate('user')
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await ClientModel.countDocuments();
    const clientsDTOArray = [];
    clients.forEach(client => {
      const clientDTO = new ClientDTO(client);
      projection.user = _getUserDTO(client.user);
      clientsDTOArray.push(
        Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, projection),
      );
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
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    const clientDTO = _pickBy(clientDTOParameter);
    const userModel = new ClientModel(clientDTO);
    const client = await userModel.save();
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
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    const clientDTOClean = _pickBy(clientDTOParameter);
    const clientResult = await ClientModel.findOneAndUpdate(
      { _id: clientDTOClean.id },
      clientDTOClean,
      {
        new: true,
      },
    ).populate('user');
    const clientDTO = new ClientDTO(clientResult);
    const client = Object.assign(Object.create(Object.getPrototypeOf(clientDTO)), clientDTO, {
      user: _getUserDTO(clientResult.user),
    });

    return client;
  } catch (err) {
    throw err;
  }
};

export const remove = async clientDTOParameter => {
  try {
    if (!(clientDTOParameter instanceof ClientDTO))
      throw new InstanceofError('Param sent need to be an ClientDTO.');

    await ClientModel.findOneAndRemove({ _id: clientDTOParameter.id });
  } catch (err) {
    throw err;
  }
};

const _getUserDTO = user => {
  const userDTO = new UserDTO(user);
  return Object.assign(Object.create(Object.getPrototypeOf(userDTO)), userDTO, {
    password: undefined,
  });
};
