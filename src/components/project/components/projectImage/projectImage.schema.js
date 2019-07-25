import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const ProjectImageSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  main: {
    type: Boolean,
    default: false,
  },
  coverPage: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export default ProjectImageSchema;
