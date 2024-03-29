import * as EmployeeService from './employee.service';
import EmployeeDTO from './employee.dto';

import { DTO as UserDTO } from '@components/user';
import { roles as Role } from '@components/user/config';

import { MissingParameterError, UnauthorizedActionError } from '@libraries/Error';

export const create = async (req, res, next) => {
  try {
    const {
      dni,
      lastName,
      socialInstagram,
      name,
      socialLinkedin,
      phone,
      socialFacebook,
      web,
      workPosition,
      fiscalAddress,
      password,
      email,
    } = req.body;

    const userDTO = new UserDTO({ name, lastName, email, password });

    const employeeDTO = new EmployeeDTO({
      dni,
      fiscalAddress,
      web,
      socialFacebook,
      workPosition,
      phone,
      socialLinkedin,
      socialInstagram,
      user: userDTO,
    });

    const employee = await EmployeeService.create(employeeDTO);
    res.status(201).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const update = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    if (Role.Admin != req.user.role && idParameter != req.user.employeeId)
      throw new UnauthorizedActionError('You can not update this employee.');

    const {
      dni,
      lastName,
      socialInstagram,
      name,
      socialLinkedin,
      phone,
      socialFacebook,
      web,
      workPosition,
      fiscalAddress,
      password,
      email,
      id,
    } = Object.assign({}, req.body, {
      id: idParameter,
    });

    const userDTO = new UserDTO({ name, lastName, email, password });

    const employeeDTO = new EmployeeDTO({
      dni,
      fiscalAddress,
      web,
      socialFacebook,
      workPosition,
      phone,
      socialLinkedin,
      socialInstagram,
      id,
      user: userDTO,
    });

    const employee = await EmployeeService.update(employeeDTO);
    res.status(200).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const remove = async (req, res, next) => {
  const idParameter = req.params.id;

  try {
    if (!idParameter) throw new MissingParameterError(['id']);
    const employeeDTO = new EmployeeDTO({ id: idParameter });
    await EmployeeService.remove(employeeDTO);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

export const getOne = async (req, res, next) => {
  const idParameter = req.params.id;
  try {
    if (!idParameter) throw new MissingParameterError(['id']);

    //Check Owner of employee.
    //TODO: Por ahora comprobaremos la propiedad en el update.
    // if (Role.Admin != req.user.role && id != req.user.employeeId)
    // throw new UnauthorizedActionError('You can not get this employee.');

    const employeeDTO = new EmployeeDTO({ id: idParameter });
    const employee = await EmployeeService.getOne(employeeDTO);
    res.status(200).json(employee);
  } catch (err) {
    return next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const pageParameter = req.params.page;
    const limitParameter = req.params.limit;

    const employees = await EmployeeService.getAll(pageParameter, limitParameter);
    res.status(200).json(employees);
  } catch (err) {
    return next(err);
  }
};
