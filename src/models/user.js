const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      requred: true
    },
    avatar: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = new mongoose.model('User', UserSchema);

module.exports = User;
