var mongoose = require('mongoose');

var excelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  dob: {
    type: String,
  },
  workexp: {
    type: String,
  },
  resumetitle: {
    type: String,
  },
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  employer: {
    type: String,
  },
  destination: {
    type: String,
  },
});

module.exports = mongoose.model('userModel', excelSchema);
