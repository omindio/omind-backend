import { Router } from 'express';
const routes = Router();

import { AuthLibrary } from '@libraries'; 

const authorize = AuthLibrary.authorize;
const Role = AuthLibrary.roles;

import * as Controller from './user.controller';

routes.get('/', authorize([Role.Admin]), Controller.getAll);

routes.post('/', Controller.create);

routes.get('/:id', authorize([Role.Admin, Role.User]), Controller.getOne);

routes.patch('/:id', authorize([Role.Admin, Role.User]), Controller.update);

routes.delete('/:id', authorize([Role.Admin]), Controller.remove);

routes.post('/auth', Controller.auth);

export default routes;
