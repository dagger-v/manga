const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Create User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: String,
  manga: [
    {
      title: String,
      image: Number,
      status: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  profilePicture: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// hash password
userSchema.plugin(passportLocalMongoose);

// check if username / email is taken
userSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("User", userSchema);
