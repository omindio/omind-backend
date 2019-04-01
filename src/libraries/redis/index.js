import redis from 'redis';
import { config } from '@config';

export const initialize = () => {

    const REDIS_URL = config.REDIS_URL;
    const client = redis.createClient(REDIS_URL);

    client.on('connect', () => {
        console.log(`Connected to redis`);
    });
    client.on('error', err => {
        console.log(`Error: ${err}`);
    });

};