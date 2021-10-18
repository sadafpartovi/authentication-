const UserModel = require("../model/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendOTP = async (email) => {
  let random = Math.floor(Math.random() * (99999 + 1)).toString();
  random = ("00000" + random).slice(-5);
  console.log(random);
  const user = await UserModel.findOne({ email });
  if (!user) {
    await UserModel.create({
      otp: random,
      email,
      createTime: new Date().getTime(),
    });
  } else {
    if (new Date().getTime() - user.createTime < 2 * 60 * 1000) {
      throw new Error("already sent! wait for 2 more muinutes");
    }
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { otp: random, createTime: new Date().getTime() } }
    );
  }
};

const verifyOTP = async (otp, email) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Register Please!");
  if (user.otp !== otp) throw new Error("Wrong OTP");
  if (new Date().getTime() - user.createTime > 2 * 60 * 1000)
    throw new Error("OTP Expired");

  const token = createToken(user._id);
  return { token, isRegistered: user.isRegistered };
};

const createToken = (userId) => {
  const data = {
    userId,
    role: "user",
  };
  return jwt.sign(data, "sadaf");
};

const register = async (name, password, userId) => {
  const user = await UserModel.findById(userId);
  user.name = name;
  const hashPasswprd = crypto.createHash('sha512').update(password, 'utf8').digest('hex')
  user.password = hashPasswprd;
  user.isRegistered = true;
  user.save();
};

const login = async (email, password) => {
  const user = await UserModel.findOne({email});
  const hashPasswprd = crypto.createHash('sha512').update(password, 'utf8').digest('hex');
  if ((!user) && user.password === hashPasswprd) {
    return createToken(user._id);
  } else throw new Error('username or password is incorrect')
};

module.exports = { sendOTP, verifyOTP, register, login };
