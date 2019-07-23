import { Router } from 'express';
const routes = Router();
import * as ProjectController from './project.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

routes.get('/:id', middleware.authorize([Role.Admin]), ProjectController.getOne);

routes.post('/', middleware.authorize([Role.Admin]), ProjectController.create);

routes.patch('/:id', middleware.authorize([Role.Admin]), ProjectController.update);

routes.delete('/:id', middleware.authorize([Role.Admin]), ProjectController.remove);

routes.get('/:page?/:limit?', middleware.authorize([Role.Admin]), ProjectController.getAll);

export default routes;