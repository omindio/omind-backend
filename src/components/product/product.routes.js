import { Router } from 'express';

import * as ProductController from './product.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

import { UploadMidleware } from '@libraries';

export const protectedRoutes = () => {
  const routes = Router();
  //videos
  routes.post('/:productId/videos', middleware.authorize([Role.Admin]), ProductController.addVideo);
  routes.patch(
    '/:productId/videos/:videoId',
    middleware.authorize([Role.Admin]),
    ProductController.updateVideo,
  );
  routes.delete(
    '/:productId/videos/:videoId',
    middleware.authorize([Role.Admin]),
    ProductController.removeVideo,
  );

  //images
  routes.post(
    '/:productId/images',
    UploadMidleware.single('imageFile'),
    middleware.authorize([Role.Admin]),
    ProductController.addImage,
  );
  routes.patch(
    '/:productId/images/:imageId',
    UploadMidleware.single('imageFile'),
    middleware.authorize([Role.Admin]),
    ProductController.updateImage,
  );
  routes.delete(
    '/:productId/images/:imageId',
    middleware.authorize([Role.Admin]),
    ProductController.removeImage,
  );

  //product information
  routes.get('/:id', middleware.authorize([Role.Admin]), ProductController.getOne);
  routes.post('/', middleware.authorize([Role.Admin]), ProductController.create);
  routes.patch('/:id', middleware.authorize([Role.Admin]), ProductController.update);
  routes.delete('/:id', middleware.authorize([Role.Admin]), ProductController.remove);
  routes.get('/:page?/:limit?', middleware.authorize([Role.Admin]), ProductController.getAll);

  return routes;
};

export const publicRoutes = () => {
  const routes = Router();

  routes.get('/:slug', ProductController.publicGetOne);
  routes.get('/:page?/:limit?', ProductController.publicGetAll);

  return routes;
};
