'use strict';

const { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } = require('graphql');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
  },
});

const userInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

module.exports.userType = userType;
module.exports.userInputType = userInputType;

