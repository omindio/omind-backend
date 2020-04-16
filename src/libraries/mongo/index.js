import mongoose from 'mongoose';
import { config } from '@config';
//TODO: FIX
let db;
export const connect = () => {
  return new Promise(function (resolve, reject) {
    if (db) return db;
    mongoose.Promise = global.Promise;
    mongoose
      .connect(config.dbUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        autoIndex: false,
        useFindAndModify: false,
      })
      .then(() => {
        resolve(db);
      })
      .catch((err) => {
        console.log('Error creating db connection: ' + err);
        reject(db);
      });
  });
};
