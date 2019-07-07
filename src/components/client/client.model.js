import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  logo: {
    type: String,
    required: false,
  },
  cif: {
    type: String,
    required: false,
  },
  fiscalAddress: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  /*bankAccount: {
    type: String,
    required: false,
  },*/
  public: {
    type: Boolean,
    default: false,
  },
  socialLinkedin: {
    type: String,
    required: false,
  },
  socialFacebook: {
    type: String,
    required: false,
  },
  socialInstagram: {
    type: String,
    required: false,
  },
  web: {
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

let Client = mongoose.model('Client', ClientSchema);

export default Client;
