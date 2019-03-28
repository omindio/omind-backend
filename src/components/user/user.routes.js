import { Router } from 'express';
const routes = Router();

import * as Middleware from './auth/auth.middleware';

import * as Controller from './user.controller';
import { roles as Role } from './config/roles';

routes.get('/', Middleware.authorize([Role.Admin]), Controller.getAll);

routes.post('/', Middleware.authorize([Role.Admin]), Controller.create);

routes.get('/:id', Middleware.authorize([Role.Admin, Role.User]), Controller.getOne);

routes.patch('/:id', Middleware.authorize([Role.Admin, Role.User]), Controller.update);

routes.delete('/:id', Middleware.authorize([Role.Admin]), Controller.remove);

export default routes;
