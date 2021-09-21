const UserModel = require('../model/user');

const sendOTP = async (email) => {
  let random = Math.floor(Math.random() * (99999 + 1)).toString();
  random = ('00000' + random).slice(-5);
  console.log(random);
  const user = await UserModel.findOne({email})
  if (!user) {
    await UserModel.create({
      otp: random,
      email,
      createTime: new Date().getTime(),
    });
  } else {
    if (new Date().getTime() - user.createTime < 2 * 60 * 1000) {
      throw new Error('already sent! wait for 2 more muinutes')
    }
    await UserModel.updateOne({_id:user._id}, {$set: {otp: random, createTime: new Date().getTime()}})
  }
}



module.exports = {sendOTP};