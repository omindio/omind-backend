//Data Access Layer
import _pickBy from 'lodash.pickby';
import BankAccountModel from './bankAccount.model';
import BankAccountDTO from './bankAccount.dto';

import { InstanceofError } from '@libraries/Error';

export const getOne = async params => {
  try {
    const bankAccountResult = await BankAccountModel.findOne(params);
    if (bankAccountResult && bankAccountDTO.user) {
      const bankAccountDTO = new BankAccountDTO(bankAccountResult);

      return bankAccountDTO;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const bankAccountResult = await BankAccountModel.findById(idParameter);

    if (bankAccountResult) {
      const bankAccountDTO = new BankAccountDTO(bankAccountResult);
      return bankAccountDTO;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneByUserId = async userIdParameter => {
  try {
    const bankAccountResult = await BankAccountModel.findOne({ user: userIdParameter });
    if (bankAccountResult) {
      const bankAccountDTO = new BankAccountDTO(bankAccountResult);
      return bankAccountDTO;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const bankAccounts = await BankAccountModel.find({})
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await BankAccountModel.countDocuments();
    const bankAccountsDTOArray = [];
    bankAccounts.forEach(bankAccount => {
      const bankAccountDTO = new BankAccountDTO(bankAccount);
      bankAccountsDTOArray.push(
        Object.assign(
          Object.create(Object.getPrototypeOf(bankAccountDTO)),
          bankAccountDTO,
          projection,
        ),
      );
    });
    return {
      bankAccounts: bankAccountsDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async bankAccountDTOParameter => {
  try {
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    const bankAccountDTO = _pickBy(bankAccountDTOParameter);
    const bankAccountModel = new BankAccountModel(bankAccountDTO);
    const bankAccount = await bankAccountModel.save();
    return new BankAccountDTO(bankAccount);
  } catch (err) {
    throw err;
  }
};

export const update = async bankAccountDTOParameter => {
  try {
    if (!(bankAccountDTOParameter instanceof BankAccountDTO))
      throw new InstanceofError('Param sent need to be an BankAccountDTO.');

    const bankAccountDTOClean = _pickBy(bankAccountDTOParameter);
    const bankAccountResult = await BankAccountModel.findOneAndUpdate(
      { _id: bankAccountDTOClean.id },
      bankAccountDTOClean,
      {
        new: true,
      },
    );
    const bankAccountDTO = new BankAccountDTO(bankAccountResult);

    return bankAccountDTO;
  } catch (err) {
    throw err;
  }
};

export const removeByUser = async BankAccountDTOParameter => {
  if (!(BankAccountDTOParameter instanceof BankAccountDTO))
    throw new InstanceofError('Param sent need to be an BankAccountDTO.');

  try {
    await BankAccountModel.findOneAndRemove({ user: BankAccountDTOParameter.user });
  } catch (err) {
    throw err;
  }
};

export const remove = async bankAccountDTOParameter => {
  if (!(bankAccountDTOParameter instanceof BankAccountDTO))
    throw new InstanceofError('Param sent need to be an BankAccountDTO.');

  try {
    await BankAccountModel.findOneAndRemove({ _id: bankAccountDTOParameter.id });
  } catch (err) {
    throw err;
  }
};
