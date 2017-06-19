'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = Promise;
const UserSchema = new Schema({
  username: {
    type: 'String',
  },
  password: {
    type: 'String',
  },
  /* auth: {
     type: 'Arrays'
   },*/
  salt: {
    type: 'String',
  },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
