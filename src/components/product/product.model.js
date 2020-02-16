import mongoose from 'mongoose';

import { productImage, productVideo } from './components';

const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
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
  facebookUrl: {
    type: String,
    required: false,
  },
  youtubeUrl: {
    type: String,
    required: false,
  },
  soundcloudUrl: {
    type: String,
    required: false,
  },
  instagramUrl: {
    type: String,
    required: false,
  },
  webUrl: {
    type: String,
    required: false,
  },
  linkedinUrl: {
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
  images: [productImage.Schema],
  videos: [productVideo.Schema],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
