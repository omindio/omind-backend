//Data Access Layer
import _pickBy from 'lodash.pickby';
import EmployeeModel from './employee.model';
import EmployeeDTO from './employee.dto';

import { InstanceofError } from '@libraries/Error';
import { DTO as UserDTO } from '@components/user';

export const getOne = async params => {
  try {
    const employeeResult = await EmployeeModel.findOne(params).populate('user');
    const employeeDTO = new EmployeeDTO(employeeResult);
    if (employeeResult && employeeDTO.user) {
      const employee = Object.assign(
        Object.create(Object.getPrototypeOf(employeeDTO)),
        employeeDTO,
        {
          user: _getUserDTO(employeeResult.user),
        },
      );
      return employee;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getOneById = async idParameter => {
  try {
    const employeeResult = await EmployeeModel.findById(idParameter).populate('user');
    const employeeDTO = new EmployeeDTO(employeeResult);
    if (employeeResult) {
      const employee = Object.assign(
        Object.create(Object.getPrototypeOf(employeeDTO)),
        employeeDTO,
        {
          user: _getUserDTO(employeeResult.user),
        },
      );
      return employee;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

export const getAll = async (projection = {}, pagination) => {
  try {
    const employees = await EmployeeModel.find({})
      .populate('user')
      .sort({ createdDate: 'desc' })
      .skip(pagination.skip)
      .limit(pagination.limit);
    const count = await EmployeeModel.countDocuments();
    const employeesDTOArray = [];
    employees.forEach(employee => {
      const employeeDTO = new EmployeeDTO(employee);
      projection.user = _getUserDTO(employee.user);
      //employeesDTOArray.push(Object.assign({}, employeeDTO, projection));
      employeesDTOArray.push(
        Object.assign(Object.create(Object.getPrototypeOf(employeeDTO)), employeeDTO, projection),
      );
    });
    return {
      employees: employeesDTOArray,
      count: count,
    };
  } catch (err) {
    throw err;
  }
};

export const create = async employeeDTOParameter => {
  try {
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    const employeeDTO = _pickBy(employeeDTOParameter);
    const employeeModel = new EmployeeModel(employeeDTO);
    const employee = await employeeModel.save();
    return new EmployeeDTO(employee);
  } catch (err) {
    throw err;
  }
};

export const update = async employeeDTOParameter => {
  try {
    if (!(employeeDTOParameter instanceof EmployeeDTO))
      throw new InstanceofError('Param sent need to be an EmployeeDTO.');

    const employeeDTOClean = _pickBy(employeeDTOParameter, v => v !== null && v !== undefined);
    const employeeResult = await EmployeeModel.findOneAndUpdate(
      { _id: employeeDTOClean.id },
      employeeDTOClean,
      {
        new: true,
      },
    ).populate('user');
    const employeeDTO = new EmployeeDTO(employeeResult);
    const employee = Object.assign(Object.create(Object.getPrototypeOf(employeeDTO)), employeeDTO, {
      user: _getUserDTO(employeeResult.user),
    });

    return employee;
  } catch (err) {
    throw err;
  }
};

export const remove = async employeeDTOParameter => {
  if (!(employeeDTOParameter instanceof EmployeeDTO))
    throw new InstanceofError('Param sent need to be an EmployeeDTO.');

  try {
    await EmployeeModel.findOneAndRemove({ _id: employeeDTOParameter.id });
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
