import { Router } from 'express';
const routes = Router();
import * as EmployeeController from './employee.controller';
import { roles as Role } from '@components/user/config';
import { middleware } from '@components/auth';

routes.get('/:id', middleware.authorize([Role.Admin, Role.Employee]), EmployeeController.getOne);

routes.post('/', middleware.authorize([Role.Admin]), EmployeeController.create);

routes.patch('/:id', middleware.authorize([Role.Admin, Role.Employee]), EmployeeController.update);

routes.delete('/:id', middleware.authorize([Role.Admin]), EmployeeController.remove);

routes.get(
  '/:page?/:limit?',
  middleware.authorize([Role.Admin, Role.Employee]),
  EmployeeController.getAll,
);

export default routes;
