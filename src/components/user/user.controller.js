import * as UserService from './user.service';
import UserDTO from './user.dto';
import { roles as Role } from './config/roles';

import { 
    MissingParametersError, 
    UnauthorizedActionError 
} from '@libraries/error-handler';

export const create = (req, res, next) => {
    let userDTO = new UserDTO(req.body);
   
    UserService.create(userDTO)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => { return next(err) });
};

export const update = (req, res, next) => {
    let id = req.params.id;

    if (!id) 
        return next(new MissingParametersError(['id']));

    if (Role.Admin != req.user.role && id != req.user.id)
        return next(new UnauthorizedActionError('You can not update this user.'));

    let userDTO = new UserDTO(req.body);
    userDTO._id = id;

    UserService.update(userDTO)
        .then(user => { 
            res.status(200).json(user) 
        })
        .catch(err => { 
            return next(err) 
        });
};

export const remove = (req, res, next) => {
    let id = req.params.id;

    if (!id) 
        return next(new MissingParametersError(['id']));

    let userDTO = new UserDTO({_id: id});

    UserService.remove(userDTO)
        .then(() => {
            res.status(204).send()
        })
        .catch(err => { 
            return next(err) 
        });
};

export const getOne = (req, res, next) => {
    let id = req.params.id;
    if (!id) 
        return next(new MissingParametersError(['id']));
    if (Role.Admin != req.user.role && id != req.user.id)
        return next(new UnauthorizedActionError('You can not get this user.'));

    let userDTO = new UserDTO({_id: id});

    UserService.getOne(userDTO)
        .then(user => { 
            res.status(200).json(user) 
        })
        .catch(err => { 
            return next(err) 
        });
};

export const getAll = (req, res, next) => {
    UserService.getAll()
        .then(users => { 
            res.status(200).json(users) 
        })
        .catch(err => { 
            return next(err) 
        });
};
