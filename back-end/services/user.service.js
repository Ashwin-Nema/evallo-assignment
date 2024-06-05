const { User } = require('../models');

const getLoginUser = async (details) => {
  const { email } = details;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create(details);
    user.id = user._id;
  } else {
    return updateUserById(user.id, { isGoogleAuthorized: true });
  }

  return user;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const updateUserById = async (id, update) => {
  return User.findByIdAndUpdate(id, update, { new: true });
};

module.exports = { getLoginUser, getUserById, updateUserById };
