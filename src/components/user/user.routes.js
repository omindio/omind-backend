import { Router } from 'express';
const routes = Router();

import * as AuthMiddleware from './auth/auth.middleware';

import * as UserController from './user.controller';
import { roles as Role } from './config/roles';

routes.get('/confirm-registration/:token', UserController.confirmRegistration);

routes.get('/confirm-registration/reset-token/:email', UserController.resetTokenRegistration);

routes.get('/:id', AuthMiddleware.authorize([Role.Admin, Role.User]), UserController.getOne);

routes.post('/', AuthMiddleware.authorize([Role.Admin]), UserController.create);

routes.patch('/:id', AuthMiddleware.authorize([Role.Admin, Role.User]), UserController.update);

routes.delete('/:id', AuthMiddleware.authorize([Role.Admin]), UserController.remove);

routes.get('/:page?/:limit?', AuthMiddleware.authorize([Role.Admin]), UserController.getAll);

export default routes;
