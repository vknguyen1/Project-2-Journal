const mongoose = require('mongoose');
// const Schema = mongoose.Schema; same as below.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
