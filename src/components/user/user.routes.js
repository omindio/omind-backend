import { Router } from 'express';
const routes = Router();

import { middleware } from '@components/auth';

import * as UserController from './user.controller';
import { roles as Role } from './config';

routes.get('/confirm-registration/:token', UserController.confirmRegistration);

routes.get('/confirm-registration/reset-token/:email', UserController.resetTokenRegistration);

routes.get('/:id', middleware.authorize([Role.Admin, Role.Client]), UserController.getOne);

routes.post('/', middleware.authorize([Role.Admin]), UserController.create);

routes.patch('/:id', middleware.authorize([Role.Admin, Role.Client]), UserController.update);

routes.delete('/:id', middleware.authorize([Role.Admin]), UserController.remove);

routes.get('/:page?/:limit?', middleware.authorize([Role.Admin]), UserController.getAll);

export default routes;
