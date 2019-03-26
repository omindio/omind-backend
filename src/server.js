import * as mongo from './config/mongo'
import * as App from './app';

import https from 'https';
import fs from 'fs';

const options = {
  //key: fs.readFileSync('/srv/www/keys/my-site-key.pem'),
  //cert: fs.readFileSync('/srv/www/keys/chain.pem')
};

const port = process.env.APP_PORT;

mongo
    .connect()
    .then(() => {

      const app = App.initialize(); 

      app.listen(port);
      //https.createServer(options, app).listen(port);
      
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
