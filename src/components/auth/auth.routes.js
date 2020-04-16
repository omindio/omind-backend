import { Router } from 'express';
const routes = Router();

import * as Controller from './auth.controller';

routes.post('/', Controller.auth);

routes.post('/browser', Controller.authBrowser);

routes.post('/browser/logout', Controller.authBrowserLogout);

export default routes;
