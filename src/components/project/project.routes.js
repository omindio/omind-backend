import { Router } from 'express';

import * as ProjectController from './project.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

import { UploadMidleware } from '@libraries';

export const protectedRoutes = () => {
  const routes = Router();

  //images
  routes.post(
    '/:projectId/images',
    UploadMidleware.single('imageFile'),
    middleware.authorize([Role.Admin]),
    ProjectController.addImage,
  );
  routes.patch(
    '/:projectId/images/:imageId',
    UploadMidleware.single('imageFile'),
    middleware.authorize([Role.Admin]),
    ProjectController.updateImage,
  );
  routes.delete(
    '/:projectId/images/:imageId',
    middleware.authorize([Role.Admin]),
    ProjectController.removeImage,
  );

  //project information
  routes.get('/:id', middleware.authorize([Role.Admin]), ProjectController.getOne);
  routes.post('/', middleware.authorize([Role.Admin]), ProjectController.create);
  routes.patch('/:id', middleware.authorize([Role.Admin]), ProjectController.update);
  routes.delete('/:id', middleware.authorize([Role.Admin]), ProjectController.remove);
  routes.get('/:page?/:limit?', middleware.authorize([Role.Admin]), ProjectController.getAll);

  return routes;
};

export const publicRoutes = () => {
  const routes = Router();

  routes.get('/:slug', ProjectController.publicGetOne);
  routes.get('/:page?/:limit?', ProjectController.publicGetAll);

  return routes;
};
