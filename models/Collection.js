const mongoose = require("mongoose");

// Create Collection Schema
const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    ref: "User", // Reference to the user who made the Collection update
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
