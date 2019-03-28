import * as Service from './user.service';
import { roles as Role } from './config/roles';

import { 
    MissingParametersError, 
    UnauthorizedActionError 
} from '@libraries/error-handler';

export const create = (req, res, next) => {
    let userData = req.body;
    Service.create(userData)
        .then(user => {
            res.status(201).json({
                user: user
            })
        })
        .catch(next);
};

export const update = (req, res, next) => {
    let id = req.params.id;
    if (!id) next(new MissingParametersError(['id']));

    let userData = req.body;

    if (Role.Admin != req.user.role && id != req.user.id)
        next(new UnauthorizedActionError('You can not update this user.'));

    Service.update(id, userData)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(next);
};

export const remove = (req, res, next) => {
    let id = req.params.id;
    if (!id) next(new MissingParametersError(['id']));

    Service.remove(id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

export const getOne = (req, res, next) => {
    let id = req.params.id;
    if (!id) next(new MissingParametersError(['id']));
    if (Role.Admin != req.user.role && id != req.user.id)
        next(new UnauthorizedActionError('You can not get this user.'));

    Service.getOne(id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(next);
};

export const getAll = (req, res, next) => {
    Service.getAll()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(next);
};
