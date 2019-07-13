import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const EmployeeSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  dni: {
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
  workPosition: {
    type: String,
    required: false,
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

let Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
