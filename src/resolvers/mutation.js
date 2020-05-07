const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const gravatar = require('../utils/gravatar');

module.exports = {
  newNote: async (parent, args, { models, request: { user } }, info) => {
    if (!user) throw new Error('Authorization Failed!! Sign in to Continue');

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  deleteNote: async (parent, { id }, { models, request: { user } }, info) => {
    if (!user) throw new Error('Authorization Failed!! Sign in to Continue');
    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id)
      throw new Error('You donot have permission to delete this note!!');

    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (
    parent,
    { id, content },
    { models, request: { user } },
    info
  ) => {
    if (!user) throw new Error('Authorization Failed!! Sign in to Continue');

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id)
      throw new Error('You donot have permission to update this note!!');

    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    );
  },
  signUp: async (parent, { username, email, password }, { models }, info) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);

    const avatar = gravatar(email);

    try {
      const user = await models.User.create({
        username,
        email,
        password: hashed,
        avatar
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Error Creating Account!!!');
    }
  },
  signIn: async (parent, { email, password }, { models }, info) => {
    email = email.trim().toLowerCase();

    const user = await models.User.findOne({ email });

    if (!user) throw new Error('Email donot exist!!');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error('Email and Password donot match');

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },

  toggleFavourite: async (
    parent,
    { id },
    { models, request: { user } },
    info
  ) => {
    if (!user) throw new Error('Authorization Failed!! Sign in to Continue');

    const noteIsInDb = await models.Note.findById(id);

    const hasUser = noteIsInDb.favouritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favouritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: { favouriteCount: -1 }
        },
        {
          new: true
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favouritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: { favouriteCount: 1 }
        },
        {
          new: true
        }
      );
    }
  }
};
