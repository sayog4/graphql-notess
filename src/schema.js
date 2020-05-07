module.exports = `
scalar DateTime
  type Note {
    id: ID!
    content: String!
    author: User!
    favouriteCount: Int!
    favouritedBy: [User!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes:[Note!]!
    favourites: [Note!]!
  }
  type NoteFeed{
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    notes:[Note!]!
    note(id: ID!): Note!

    me: User
    users: [User!]!

    noteFeed(cursor: String): NoteFeed
    
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!,content: String!): Note!
    deleteNote(id: ID!): Boolean!

    signUp(username: String!,email:String!,password:String!): String!
    signIn(email:String!,password:String!): String!

    toggleFavourite(id:ID!): Note!
  
  }
`;
