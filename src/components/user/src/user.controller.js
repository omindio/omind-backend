import { AuthLibrary } from '@libraries'; 
const Role = AuthLibrary.roles;

import * as Service from './user.service';

export const create = (req, res, next) => {
    let userData = req.body;
    Service.create(userData)
        .then(user => {
            res.status(200).json({
                status: 'success', 
                message: 'User created successfully.',
                //TODO: Return specific fields
                //data: user
            })
        })
        .catch(next);
};

export const update = (req, res, next) => {
    let id = req.params.id;
    let userData = req.body;

    if (Role.Admin != req.user.role && id != req.user.id)
        next(new Error('You are not the owner of this user.'));

    Service.update(id, userData)
        .then(user => {
            res.status(200).json({
                status: 'success', 
                message: 'User updated successfully.',
                //TODO: Return specific fields
                //data: user
            })
        })
        .catch(next);
};

export const remove = (req, res, next) => {
    let id = req.params.id;
    Service.remove(id)
        .then(message => {
            res.status(200).json({
                status: 'success', 
                message: message,
            })
        })
        .catch(next);
};

export const getOne = (req, res, next) => {
    let id = req.params.id;

    if (Role.Admin != req.user.role && id != req.user.id)
        next(new Error('You are not the owner of this user.'));

    Service.getOne(id)
        .then(user => {
            res.status(200).json({
                status: 'success', 
                data: user
            })
        })
        .catch(next);
};

export const getAll = (req, res, next) => {
    Service.getAll()
        .then(users => {
            res.status(200).json({
                status: 'success',
                data: users
            });
        })
        .catch(next);
};

export const auth = (req, res, next) => {
    let userData = req.body;

    Service.auth(userData)
        .then(token => {
            res.status(200).json({
                status: 'success',
                data: token
            });
        })
        .catch(next);     
};
