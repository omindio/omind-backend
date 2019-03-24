import { Router } from 'express';
const routes = Router();

import {
    getAll,
    getOne,
    create,
    remove,
    update
} from '../../controllers/user.controller';

import { authorize, Role } from '../../security/middleware.security.js';

routes.route('/')
    .get(authorize([Role.Admin]), getAll)
    .post(create);

routes.route('/:user_id')
    .get(authorize([Role.Admin, Role.User]), getOne)
    .patch(authorize([Role.Admin, Role.User]), update)
    .delete(authorize([Role.Admin]), remove);

export default routes;