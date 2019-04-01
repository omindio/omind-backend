import 'module-alias/register';

import { Mongo } from '@libraries';
import * as App from './app';

import https from 'https';
import http from 'http';
//import fs from 'fs';

global.__base = __dirname + '/';

const options = {
  //key: fs.readFileSync('/srv/www/keys/my-site-key.pem'),
  //cert: fs.readFileSync('/srv/www/keys/chain.pem')
};

const port = process.env.APP_PORT;

Mongo
    .connect()
    .then(() => {

      const app = App.initialize(); 

      //app.listen(port);
      http.createServer(app).listen(port);
      //https.createServer(options, app).listen(port);
      console.log('APP Running!');
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
