'use strict';

const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');

const fakeDatabase = {
  a: {
    id: 'a',
    name: 'alice',
  },
  b: {
    id: 'b',
    name: 'bob',
  },
};


const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
  },
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        },
      },
      name: {
        type: GraphQLString,
        resolve() {
          return 'liu';
        },
      },
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLString,
          },
        },
        resolve(_, { id }) {
          if (fakeDatabase[id]) {
            return fakeDatabase[id];
          }
          throw new Error('id %s does not exist', id);
        },
      },
    },
  }),
});

module.exports = schema;

