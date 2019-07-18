//import { Mongo } from '@libraries';
import mongoose from 'mongoose';
import { config } from '@config';
import * as App from './app';

import http from 'http';

global.__base = __dirname + '/';

const port = process.env.PORT || process.env.APP_PORT || 3000;

mongoose.connect(config.dbUri, config.mongoOpts);

const app = App.initialize();
const server = http.createServer(app);

server.listen(port);
console.log('APP Running!');

export default app;
