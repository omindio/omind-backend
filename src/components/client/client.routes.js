import { Router } from 'express';
const routes = Router();
import * as ClientController from './client.controller';
//import { Role } from '@components/user';
const Role = {
  Admin: '',
  Client: '',
};
import { middleware } from '@components/auth';

routes.get('/:id', middleware.authorize([Role.Admin, Role.Client]), ClientController.getOne);

routes.post('/', middleware.authorize([Role.Admin]), ClientController.create);

routes.patch('/:id', middleware.authorize([Role.Admin, Role.Client]), ClientController.update);

routes.delete('/:id', middleware.authorize([Role.Admin]), ClientController.remove);

routes.get('/:page?/:limit?', middleware.authorize([Role.Admin]), ClientController.getAll);

export default routes;
