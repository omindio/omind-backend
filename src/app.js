import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import correlator from 'express-correlation-id';
import morgan from 'morgan';

import { UserComponent } from '@components';
import { Swagger, Error, Redis, Winston } from '@libraries';

const app = express();

export const initialize = () => {

    app.use(helmet());
    app.use(cors());
    //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(morgan('combined', { stream: Winston.stream }));

    //correlator id - header (x-correlation-id)
    app.use(correlator());

    //initialize components
    UserComponent.initialize(app);

    Swagger.initialize(app);
    //Redis.initialize();
    Error.Middleware.initialize(app);

    return app;

};