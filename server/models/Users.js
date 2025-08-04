const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true, // ensure no duplicate emails
      lowercase: true, // normalize email
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 8 // enforce basic strength
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active"
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

const Users = mongoose.model("User", userSchema);

module.exports = Users;
