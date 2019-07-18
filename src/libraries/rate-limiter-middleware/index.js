import { RateLimiterMongo } from 'rate-limiter-flexible';
import mongoose from 'mongoose';

import { config } from '@config';
import { MillisToMinutes } from '@libraries';

import { TooManyRequestsError } from './Error';

const mongoConn = mongoose.createConnection(config.dbUri, config.mongoOpts);

const opts = {
  mongo: mongoConn,
  dbName: config.dbName,
  tableName: config.rateLimiter.tableName,
  points: config.rateLimiter.points,
  duration: config.rateLimiter.duration,
  blockDuration: config.rateLimiter.blockDuration,
  inmemoryBlockOnConsumed: config.rateLimiter.inMemoryBlockOnConsumed,
  inmemoryBlockDuration: config.rateLimiter.inMemoryBlockDuration,
};

const rateLimiter = new RateLimiterMongo(opts);

const rateLimiterMiddleware = (req, res, next) => {
  // const key = req.user ? req.user.id : req.ip;
  const key = req.ip;
  // const pointsToConsume = req.user ? config.userPointsToConsume : config.visitorPointsToConsume;
  const pointsToConsume = 1;

  rateLimiter
    .consume(key, pointsToConsume)
    .then(() => {
      next();
    })
    .catch(err => {
      if (err.msBeforeNext) {
        res.set({
          'Retry-After': err.msBeforeNext / 1000,
          'X-RateLimit-Limit': opts.points,
          'X-RateLimit-Remaining': err.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + err.msBeforeNext),
        });

        return next(
          new TooManyRequestsError(
            `Too Many Requests. Try again in ${MillisToMinutes(err.msBeforeNext)} minutes.`,
          ),
        );
      }
      return next(new TooManyRequestsError());
    });
};

export default rateLimiterMiddleware;
