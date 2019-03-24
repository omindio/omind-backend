import mongoose from 'mongoose';

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
}
