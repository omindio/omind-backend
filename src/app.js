import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import correlator from 'express-correlation-id';
import morgan from 'morgan';
import compression from 'compression';

import { config } from './config';

//import i18next from 'i18next';
//import BackendAdapter from 'i18next-multiload-backend-adapter';
//import XHR from 'i18next-xhr-backend';
//import Backend from 'i18next-chained-backend';

import { UserComponent } from '@components';
import { Swagger, ErrorHandler, Winston } from '@libraries';

const app = express();

export const initialize = () => {
  app.use(helmet());
  app.use(cors());
  //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());

  if (config.env !== 'test') app.use(morgan('combined', { stream: Winston.stream }));
  //correlator id - header (x-correlation-id)
  app.use(correlator());

  //initialize components
  UserComponent.initialize(app);

  Swagger.initialize(app);
  ErrorHandler.Middleware.initialize(app);

  return app;
};
