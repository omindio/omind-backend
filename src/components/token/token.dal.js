import _pickBy from 'lodash.pickby';

import TokenDTO from './token.dto';
import TokenModel from './token.model';

export const getOneByUserId = async (userIdParameter) => {
    try {
        let token = await TokenModel.findOne({userId: userIdParameter});
        return new TokenDTO(token);
    } catch (err) {
        throw err;
    }
};

export const getOneByToken = async (tokenParameter) => {
    try {
        let token = await TokenModel.findOne({token: tokenParameter});
        return new TokenDTO(token);
    } catch (err) {
        throw err;
    }
};

export const create = async (tokenDTOParameter) => {
    try {
        let tokenDTO = _pickBy(tokenDTOParameter);
        let tokenModel = new TokenModel(tokenDTO);
        let token = await tokenModel.save();
        return new TokenDTO(token);
    } catch (err) {
        throw err;
    }
};

export const update = async (tokenDTOParameter) => {
    try {
        let tokenDTO = _pickBy(tokenDTOParameter);
        let token = await TokenModel.findOneAndUpdate({_id: tokenDTO.id}, tokenDTO, {new: true});
        return new TokenDTO(token);
    } catch (err) {
        throw err;
    }
};

export const remove = async (tokenDTOParameter) => {
    try {
        await TokenModel.findOneAndRemove({_id: tokenDTOParameter.id});
    } catch(err) {
        throw err;
    }
};