import _pickBy from 'lodash.pickby';

import TokenDTO from './token.dto';
import TokenModel from './token.model';
import { InstanceofError } from '@libraries/Error';

export const getOneByUserId = async userIdParameter => {
  try {
    const token = await TokenModel.findOne({ userId: userIdParameter });
    return new TokenDTO(token);
  } catch (err) {
    throw err;
  }
};

export const getOneByToken = async tokenParameter => {
  try {
    const token = await TokenModel.findOne({ token: tokenParameter });
    return new TokenDTO(token);
  } catch (err) {
    throw err;
  }
};

export const create = async tokenDTOParameter => {
  try {
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    const tokenDTO = _pickBy(tokenDTOParameter);
    const tokenModel = new TokenModel(tokenDTO);
    const token = await tokenModel.save();
    return new TokenDTO(token);
  } catch (err) {
    throw err;
  }
};

export const update = async tokenDTOParameter => {
  try {
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    const tokenDTO = _pickBy(tokenDTOParameter);
    const token = await TokenModel.findOneAndUpdate({ _id: tokenDTO.id }, tokenDTO, { new: true });
    return new TokenDTO(token);
  } catch (err) {
    throw err;
  }
};

export const remove = async tokenDTOParameter => {
  try {
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    await TokenModel.findOneAndRemove({ _id: tokenDTOParameter.id });
  } catch (err) {
    throw err;
  }
};
