//import { Mongo } from '@libraries';
import mongoose from 'mongoose';
import { config } from '@config';
import * as App from './app';

import https from 'https';
import http from 'http';

global.__base = __dirname + '/';

const port = process.env.APP_PORT;

mongoose.connect(config.dbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
});

const app = App.initialize();

app.listen(port);
//http.createServer(app).listen(port);
//https.createServer(options, app).listen(port);
console.log('APP Running!');

export default app;

/*Mongo
    .connect()
    .then(() => {

      const app = App.initialize();

      app.listen(port);
      //http.createServer(app).listen(port);
      //https.createServer(options, app).listen(port);
      console.log('APP Running!');

    })
    .catch(err => {
      console.log('Error: ' + err);
    });*/
