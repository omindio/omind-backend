//Data Access Layer
import _pickBy from 'lodash.pickby';
import BankAccountModel from './bankAccount.model';
import BankAccountDTO from './bankAccount.dto';

import { InstanceofError } from '@libraries/Error';
import { DTO as UserDTO } from '@components/user';

export const getOne = async params => {
  try {
    const bankAccountResult = await BankAccountModel.findOne(params).populate('user');
    const bankAccountDTO = new BankAccountDTO(bankAccountResult);
    if (bankAccountResult && bankAccountDTO.user) {
      const bankAccount = Object.assign(
        Object.create(Object.getPrototypeOf(bankAccountDTO)),
        bankAccountDTO,
        {
          user: _getUserDTO(bankAccountResult.user),
        },
      );
      return bankAccount;
    } else {
      return {};
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const bankAccountResult = await BankAccountModel.findById(idParameter).populate('user');
    const bankAccountDTO = new BankAccountDTO(bankAccountResult);
    if (bankAccountResult) {
      const bankAccount = Object.assign(
        Object.create(Object.getPrototypeOf(bankAccountDTO)),
        bankAccountDTO,
        {
          user: _getUserDTO(bankAccountResult.user),
        },
      );
      return bankAccount;
    } else {
      return {};
    }
  } catch (err) {
    throw err;
  }
};

export const getOneByUserId = async userIdParameter => {
  try {
    const bankAccountResult = await BankAccountModel.findOne({ user: userIdParameter }).populate('user');
    const bankAccountDTO = new BankAccountDTO(bankAccountResult);
    if (bankAccountResult) {
      const bankAccount = Object.assign(
        Object.create(Object.getPrototypeOf(bankAccountDTO)),
        bankAccountDTO,
        {
          user: _getUserDTO(bankAccountResult.user),
        },
      );
      return bankAccount;
    } else {
      return {};
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const bankAccounts = await BankAccountModel.find({})
      .populate('user')
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await BankAccountModel.countDocuments();
    const bankAccountsDTOArray = [];
    bankAccounts.forEach(bankAccount => {
      const bankAccountDTO = new BankAccountDTO(bankAccount);
      projection.user = _getUserDTO(bankAccount.user);
      //bankAccountsDTOArray.push(Object.assign({}, bankAccountDTO, projection));
      bankAccountsDTOArray.push(
        Object.assign(Object.create(Object.getPrototypeOf(bankAccountDTO)), bankAccountDTO, projection),
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
/*
let user = await User.create({ ... })
user = await user.populate('company').execPopulate()
*/
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
    ).populate('user');
    const bankAccountDTO = new BankAccountDTO(bankAccountResult);
    const bankAccount = Object.assign(Object.create(Object.getPrototypeOf(bankAccountDTO)), bankAccountDTO, {
      user: _getUserDTO(bankAccountResult.user),
    });

    return bankAccount;
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

const _getUserDTO = user => {
  const userDTO = new UserDTO(user);
  return Object.assign(Object.create(Object.getPrototypeOf(userDTO)), userDTO, {
    password: undefined,
  });
};
