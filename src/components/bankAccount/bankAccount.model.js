import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const BankAccountSchema = new Schema({
  iban: {
    type: String,
    required: false,
  },
  swift: {
    type: String,
    required: false,
  },
  vat: {
    type: String,
    required: false,
  },
  bankName: {
    type: String,
    required: false,
  },
  routeNumber: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const BankAccount = mongoose.model('BankAccount', BankAccountSchema);

export default BankAccount;
