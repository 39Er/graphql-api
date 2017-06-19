'use strict';

const { GraphQLNonNull } = require('graphql');
const { userType, userInputType } = require('../types/userType');
const logger = require('../../global').logger;
const User = require('../../model/user');
const { passwordEncrypt } = require('../../lib/passwordEncrypt');

const register = {
  type: userType,
  args: {
    userInfo: {
      type: new GraphQLNonNull(userInputType),
    },
  },
  resolve: async function (_, { userInfo }) {
    try {
      let result = await User.findOne({ username: userInfo.username }).exec();
      if (result) {
        throw new Error('user already registed');
      }
      let passwdObject = await passwordEncrypt(userInfo.password);
      let u = await User.create({
        username: userInfo.username,
        password: passwdObject.epassword,
        salt: passwdObject.salt,
      });
      return {
        _id: u._id,
        username: u.username,
      };
    } catch (e) {
      logger.error(e);
      throw new Error(e);
    }
  },
};

module.exports.register = register;
