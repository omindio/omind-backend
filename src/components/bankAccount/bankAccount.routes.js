import { Router } from 'express';
const routes = Router();
import * as BankAccountController from './bankAccount.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

routes.post(
  '/:userId',
  middleware.authorize([Role.Admin, Role.Employee, Role.Client]),
  BankAccountController.create,
);

routes.get(
  '/:id',
  middleware.authorize([Role.Admin, Role.Employee, Role.Client]),
  BankAccountController.getOne,
);

routes.patch(
  '/:id',
  middleware.authorize([Role.Admin, Role.Employee, Role.Client]),
  BankAccountController.update,
);

// routes.delete('/:id', middleware.authorize([Role.Admin]), BankAccountController.remove);
/*
routes.get(
  '/:page?/:limit?',
  middleware.authorize([Role.Admin, Role.Employee]),
  BankAccountController.getAll,
);
*/

export default routes;
