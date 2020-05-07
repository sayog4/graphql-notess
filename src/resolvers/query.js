module.exports = {
  notes: async (parent, args, { models }, info) =>
    await models.Note.find({}).limit(100),
  note: async (parent, args, { models }, info) =>
    await models.Note.findById(args.id),
  users: async (parent, args, { request, models }, info) =>
    await models.User.find({}),
  me: async (parent, args, { models, request: { user } }, info) =>
    await models.User.findById(user.id),

  noteFeed: async (parent, { cursor }, { models }, info) => {
    const limit = 10;
    let hasNextPage = false;

    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};
