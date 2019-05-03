import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
  },
});

let Token = mongoose.model('Token', TokenSchema);

export default Token;
