import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

let User = mongoose.model('User', UserSchema);

export default User;