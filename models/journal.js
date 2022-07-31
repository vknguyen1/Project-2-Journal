// Set Depencies
const mongoose = require('mongoose');

// Schema

// const Schema = mongoose.Schema

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    entry: {
      type: String,
      required: true,
    },
    taskIsCompleted: Boolean,
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Journal', journalSchema);
