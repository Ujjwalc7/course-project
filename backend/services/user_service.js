const User = require('../models/user_model');
const jwtProvider = require('../config/jwtProvider');
const { Error } = require('mongoose');

// function to get all the users
const getAllUsers = async() => {
    try {
        const allUsers = await User.find({role: 'user'});
        return allUsers;
      } catch (error) {
        throw new Error(error);
      }
}


// function to get the user by email
const findUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("user not found with email: ", email);
      } else {
        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

// function to delete user by user's id
const deleteUserById = async(userId) => {
    try {
        await User.findByIdAndDelete(userId);
       return {message: 'User deleted', userId: userId};
      } catch (error) {
        throw new Error(error);
      }
}

// function to update user's document by user's id and data sent by the client

const updateUserById = async(userId, body) => {
    try {
        const resp = await User.findByIdAndUpdate(userId, body);
        return resp;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getAllUsers,
    updateUserById,
    deleteUserById,
    findUserByEmail
}