import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const ProjectVideoSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export default ProjectVideoSchema;
