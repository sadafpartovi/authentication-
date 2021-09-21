const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema ({
  email: String,
  name: String,
  password: String,
  otp: String,
  isRegistered: Boolean,
  createTime: Long,
});

const UserModel = mongoose.model('User', User);

module.exports = UserModel;