//import { Mongo } from '@libraries';
import mongoose from 'mongoose';
import { config } from '@config';
import * as App from './app';

import http from 'http';

global.__base = __dirname + '/';

const port = process.env.PORT || process.env.APP_PORT || 80;

mongoose.connect(config.dbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
});

const app = App.initialize();
const server = http.createServer(app);

// app.listen(port);
server.listen(port);
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
