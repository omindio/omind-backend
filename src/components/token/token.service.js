import crypto from 'crypto';

import TokenDTO from './token.dto';
import * as TokenDAL from './token.dal';

import * as TokenValidation from './validation/token.validation';

import { InstanceofError, ValidationSchemaError } from '@libraries/error-handler';
import { TokenNotFoundError, TokenExpiredError } from './Error';

//1 hours
export const expires = 3600;

export const create = async tokenDTOParameter => {
  try {
    //parameter validation
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    //run validation. Returns exceptions if fails
    await TokenValidation.createTokenSchema.validate(tokenDTOParameter);

    const token = crypto.randomBytes(16).toString('hex');
    const tokenDTO = Object.assign(
      Object.create(Object.getPrototypeOf(tokenDTOParameter)),
      tokenDTOParameter,
      { token: token },
    );

    return await TokenDAL.create(tokenDTO);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const confirm = async tokenDTOParameter => {
  try {
    //parameter validation
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    //run validation. Returns exceptions if fails
    await TokenValidation.confirmTokenSchema.validate(tokenDTOParameter);

    const tokenDTO = await TokenDAL.getOneByToken(tokenDTOParameter.token);

    if (!tokenDTO.id) throw new TokenNotFoundError();

    //check if token has expired
    const tokenCreatedAt = tokenDTO.createdAt;
    tokenCreatedAt.setSeconds(tokenCreatedAt.getSeconds() + expires);

    if (Date.now() > tokenCreatedAt.getTime()) throw new TokenExpiredError();

    await TokenDAL.remove(tokenDTO);
    return tokenDTO;
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};

export const reset = async tokenDTOParameter => {
  try {
    //parameter validation
    if (!(tokenDTOParameter instanceof TokenDTO))
      throw new InstanceofError('Param sent need to be an TokenDTO.');

    //run validation. Returns exceptions if fails
    await TokenValidation.resetTokenSchema.validate(tokenDTOParameter);

    const tokenDTOResult = await TokenDAL.getOneByUserId(tokenDTOParameter.userId);

    //if not exists any token, then create
    if (!tokenDTOResult.id) return create(tokenDTOParameter);

    const newData = {
      createdAt: new Date(),
      token: crypto.randomBytes(16).toString('hex'),
    };

    const tokenDTO = Object.assign(
      Object.create(Object.getPrototypeOf(tokenDTOResult)),
      tokenDTOResult,
      newData,
    );

    return await TokenDAL.update(tokenDTO);
  } catch (err) {
    if (err.hasOwnProperty('details')) throw new ValidationSchemaError(err);
    else throw err;
  }
};
