import { Router } from 'express';
const routes = Router();

import {
    getAll,
    getOne,
    create,
    remove,
    update
} from '../../controllers/user.controller';

import { authorize, Role } from '../../security/middleware.security';

routes.route('/')
    .get(authorize([Role.Admin]), getAll)
    /**
     * @swagger
     *
     * /users:
     *   post:
     *     description: Login to the application
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         description: Username to use for login.
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         description: User's password.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: login
     */
    .post(create);

routes.route('/:user_id')
    .get(authorize([Role.Admin, Role.User]), getOne)
    .patch(authorize([Role.Admin, Role.User]), update)
    .delete(authorize([Role.Admin]), remove);

export default routes;