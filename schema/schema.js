'use strict';

const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { user, login } = require('./queries/user');
const { register } = require('./mutations/user');

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
      user,
      login,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      register,
    },
  }),
});

module.exports = schema;

