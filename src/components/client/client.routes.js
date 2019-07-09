import { Router } from 'express';
const routes = Router();
import * as ClientController from './client.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

import { UploadMidleware } from '@libraries';

routes.get('/:id', /*middleware.authorize([Role.Admin, Role.Client]),*/ ClientController.getOne);
routes.get(
  '/slug/:slug',
  /*middleware.authorize([Role.Admin, Role.Client]),*/ ClientController.getOne,
);

routes.post(
  '/',
  UploadMidleware.single('logoFile'),
  middleware.authorize([Role.Admin]),
  ClientController.create,
);

routes.patch(
  '/:id',
  UploadMidleware.single('logoFile'),
  middleware.authorize([Role.Admin, Role.Client]),
  ClientController.update,
);

routes.delete('/:id', middleware.authorize([Role.Admin]), ClientController.remove);

routes.get('/:page?/:limit?', /*middleware.authorize([Role.Admin]),*/ ClientController.getAll);

export default routes;
