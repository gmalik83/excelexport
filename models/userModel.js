var mongoose = require('mongoose');

var excelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true, // note - this is a unqiue index - not a validation
    validate: {
      validator: function (value) {
        const self = this;
        const errorMsg = 'Email already in use!';
        return new Promise((resolve, reject) => {
          self.constructor
            .findOne({ email: value })
            .then((model) =>
              model._id ? reject(new Error(errorMsg)) : resolve(true)
            ) // if _id found then email already in use
            .catch((err) => resolve(true)); // make sure to check for db errors here
        });
      },
    },
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
