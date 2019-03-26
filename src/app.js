import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { userComponent } from './components';

const app = express();

export const initialize = () => {

    app.use(helmet());
    app.use(cors());
    //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //use morgan to log requests to the console
    app.use(morgan('dev'));

    //initialize components
    userComponent.initialize(app);

    return app;

};