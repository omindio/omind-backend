import { Router } from 'express';
const routes = Router();

import { auth } from '../../controllers/auth.controller';

routes.route('/').post(auth);

export default routes;