import mongoose from 'mongoose';
import { config } from './index';

let db;

export const connect = () => {

  return new Promise(function(resolve, reject) {
    if (db) return db;
    
		mongoose.Promise = global.Promise;

		// database connect
		mongoose
			.connect(config.dbUri, { useCreateIndex: true, useNewUrlParser: true })
			.then(() => {
				console.log('Mongo connection created.');
				resolve(db);
			})
			.catch(err => {
				console.log('Error creating db connection: ' + err);
				reject(db);
			});
	});

/*
  mongoose.connect(
    config.dbUri,{ 
      useCreateIndex: true,
      useNewUrlParser: true 
    }
  )
  .then(() => console.log('MongoDB successfully connected!'))
  .catch(err => console.log(err));*/

};
/*
export class MongoService {
  constructor(uri) {
    this._uri = uri;
  }
  getUri() {
    return this._uri;
  }
  connect () {
    mongoose.connect(
      this.getUri(),{ 
        useCreateIndex: true,
        useNewUrlParser: true 
      }
    )
    .then(() => console.log('MongoDB successfully connected!'))
    .catch(err => console.log(err));
  }
}*/