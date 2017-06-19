'use strict';

const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { user, login } = require('./queries/user');
const { register } = require('./mutations/user');

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve(_, args, context) {
          if (!context.session || !context.session.user) {
            throw new Error('Session is invilid');
          }
          return 'world';
        },
      },
      user,
      login,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      register,
    },
  }),
});

module.exports = schema;

