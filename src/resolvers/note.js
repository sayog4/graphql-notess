module.exports = {
  author: async (note, args, { models }, info) =>
    await models.User.findById(note.author),
  favouritedBy: async (note, args, { models }, info) =>
    await models.User.find({ _id: { $in: note.favoritedBy } })
};
