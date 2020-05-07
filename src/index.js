const { GraphQLServer } = require('graphql-yoga');
require('dotenv').config();
require('./db');
const jwt = require('jsonwebtoken');

const typeDefs = require('./schema');
const resolvers = require('./resolvers/index');
const models = require('./models/index');

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({ ...req, models })
});

server.express.use(async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  result => console.log(`up and running`)
);
