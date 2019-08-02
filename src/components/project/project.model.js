import mongoose from 'mongoose';

import { projectImage, projectVideo } from './components';

const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: false,
    index: true,
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
  meta_description: {
    type: String,
    required: false,
  },
  startedDate: {
    type: Date,
    default: Date.now,
  },
  finishedDate: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  /*
  pmo: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  */
  images: [projectImage.Schema],
  videos: [projectVideo.Schema],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
