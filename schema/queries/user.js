'use strict';

const { GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql');
const { userType, userInputType } = require('../types/userType');
const User = require('../../model/user');
const logger = require('../../global').logger;
const { encrypt } = require('../../lib/passwordEncrypt');

const user = {
  type: new GraphQLList(userType),
  args: {
    _id: {
      type: GraphQLString,
    },
    username: {
      type: GraphQLString,
    },
  },
  resolve: async function (_, { _id, username }, context) {
    if (!context.session || !context.session.user) {
      throw new Error('Session is invilid');
    }
    let conds = {};
    if (_id) {
      conds._id = _id;
    }
    if (username) {
      conds.username = username;
    }
    let result = null;
    try {
      result = await User.find(conds).exec();
      if (!result || result.length === 0) {
        throw new Error('wrong query');
      }
      return result;
    } catch (e) {
      logger.error(e);
      throw new Error(e);
    }
  },
};

const login = {
  type: GraphQLString,
  args: {
    userInfo: {
      type: new GraphQLNonNull(userInputType),
    },
  },
  resolve: async function (_, { userInfo }, context) {
    try {
      let result = await User.findOne({ username: userInfo.username }).exec();
      if (!result) {
        throw new Error('invlid user');
      }
      let encryptedPassword = await encrypt(userInfo.password, result.salt);
      if (encryptedPassword !== result.password) {
        throw new Error('password is incorrect');
      }
      context.session.user = result;
      return 'login success';
    } catch (e) {
      logger.error(e);
      throw new Error(e);
    }
  },

};
module.exports.user = user;
module.exports.login = login;
