const mongoose = require("mongoose");

// Create About Schema
const aboutSchema = new mongoose.Schema({
  author: {
    type: String,
    ref: "User", // Reference to the user who made the About update
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("About", aboutSchema);
