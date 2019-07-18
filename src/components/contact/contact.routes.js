import { Router } from 'express';
const routes = Router();

import * as Controller from './contact.controller';

routes.post('/send', Controller.send);

export default routes;
