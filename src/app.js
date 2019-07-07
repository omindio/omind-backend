import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import correlator from 'express-correlation-id';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { config } from './config';

//import i18next from 'i18next';
//import BackendAdapter from 'i18next-multiload-backend-adapter';
//import XHR from 'i18next-xhr-backend';
//import Backend from 'i18next-chained-backend';

import { UserComponent, AuthComponent, ClientComponent } from '@components';
import { Swagger, ErrorHandler, Winston } from '@libraries';

const app = express();

export const initialize = () => {
  app.use(helmet());
  app.use(
    cors({
      origin: [
        'http://0.0.0.0:4000',
        'http://localhost:4000',
        'http://192.168.1.101:4000',
        'https://omindbrand.com',
        'https://www.omindbrand.com',
        'https://omind-frontend-production.herokuapp.com',
        'https://omind-frontend-staging.herokuapp.com',
      ],
    }),
  );
  // app.use(cookieParser());
  //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());

  if (config.env !== 'test') app.use(morgan('combined', { stream: Winston.stream }));
  //correlator id - header (x-correlation-id)
  app.use(correlator());

  //initialize components
  UserComponent.initialize(app);
  ClientComponent.initialize(app);
  AuthComponent.initialize(app);

  Swagger.initialize(app);
  ErrorHandler.Middleware.initialize(app);

  return app;
};
