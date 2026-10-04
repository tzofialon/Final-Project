const User = require('../models/User');

const getAllUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const { username, phone, email } = userData;
  return await User.create({ username, phone, email });
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  updateUserById,
  deleteUserById
};