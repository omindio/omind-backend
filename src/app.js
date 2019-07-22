import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import correlator from 'express-correlation-id';
import morgan from 'morgan';
import compression from 'compression';
import appRoot from 'app-root-path';

import { config } from './config';

import {
  UserComponent,
  AuthComponent,
  ClientComponent,
  EmployeeComponent,
  ContactComponent,
  BankAccountComponent,
  ProjectComponent,
} from '@components';
import { Swagger, ErrorHandler, Winston, RateLimiterMiddleware } from '@libraries';

const app = express();

export const initialize = () => {
  app.use('/public', express.static(`${appRoot}/uploads`));

  //correlator id - header (x-correlation-id)
  app.use(correlator());

  app.use(helmet());
  app.use(cors({ origin: config.cors }));

  //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());

  app.use(RateLimiterMiddleware);

  if (config.env !== 'test') app.use(morgan('combined', { stream: Winston.stream }));

  //initialize components
  UserComponent.initialize(app);
  ClientComponent.initialize(app);
  EmployeeComponent.initialize(app);
  AuthComponent.initialize(app);
  ContactComponent.initialize(app);
  BankAccountComponent.initialize(app);
  ProjectComponent.initialize(app);

  Swagger.initialize(app);
  ErrorHandler.Middleware.initialize(app);

  /*
  _initializeComponents(
    {
      UserComponent,
      ClientComponent,
      EmployeeComponent,
      AuthComponent,
      ContactComponent,
      Swagger,
      ErrorHandler: ErrorHandler.Middleware,
    },
    app,
  );
*/
  return app;
};

/*
const _initializeComponents = (Components, app) => {
  Components.forEach(Component => {
    Component.initialize(app);
  });
};
*/
