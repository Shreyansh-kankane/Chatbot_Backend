const mongoose = require('mongoose');

// Define the users schema
const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the WebModel schema
const webModelSchema = new mongoose.Schema({
  namespace: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
});

// Create models
const Users = mongoose.model('Users', usersSchema);
const WebModel = mongoose.model('WebModel', webModelSchema);

module.exports = { Users, WebModel };
