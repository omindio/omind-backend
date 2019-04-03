import redis from 'redis';
import { config } from '@config';

let client = null;

if (config.env === 'development') {
    client = redis.createClient(6379, 'redis');
} else {
    client = redis.createClient(config.REDIS_URL);
}

export const middleware = (req, res, next) => {
    let key = "___expIress___" + req.originalUrl || req.url;
    client.get(key, function(err, reply){
      if(reply){
          res.send(JSON.parse(reply));
      }else{
          res.sendResponse = res.send;
          res.send = (body) => {
              client.set(key, JSON.stringify(body), 'EX', 20);
              res.sendResponse(body);
          }
          next();
      }
    });
  };