const mongoose = require("mongoose");

// Create Collection Schema
const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: "User", // Reference to the user who made the Collection update
    required: true,
  },
  status: {
    type: String,
    enum: ["plan", "current", "finish"],
    default: "plan",
  },
  favorite: { type: Boolean, default: false },
  image: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
