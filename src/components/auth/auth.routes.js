import { Router } from 'express';
const routes = Router();

import * as Controller from './auth.controller';

routes.post('/', Controller.auth);

export default routes;
