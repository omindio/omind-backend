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
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('ProjectVideo', ProjectVideoSchema);

export default Video;
