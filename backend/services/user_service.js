const User = require('../models/user_model');
const jwtProvider = require('../config/jwtProvider');
const { Error } = require('mongoose');
const fs = require('fs');

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
      const user = await User.findById(userId);
      if(user.profileImg){
        deleteOldImage(user.profileImg);
      }
        await User.findByIdAndDelete(userId);
       return {message: 'User deleted', userId: userId};
      } catch (error) {
        throw new Error(error);
      }
}

// function to update user's document by user's id and data sent by the client

const updateUserById = async(userId, body, user, res) => {
    try {
      const userFromDb = await User.findById(userId);
      
        if(userId.toString() === user._id.toString()) { //perform action only if user logged in and authenticated
          const resp = await User.findByIdAndUpdate(userId, body, {new: true}).exec(); //update user profile and return updated profile
          resp.password = undefined; //
          return resp;
        }else{
          res.status(401).json({error:"user is not authorized to perform this action"});
        }
    } catch (error) {
      console.log(error.message);
        throw new Error(error.message);
    }
}


//function to delete profile picture of the user
const deleteProfileImage = async(userId, user, res) => {
  try {
    const userFromDb = await User.findById(userId);
    
      if(user._id.toString() === userFromDb._id.toString()) { //perform action only if user logged in and authenticated
        if(userFromDb.profileImg){
            console.log(deleteOldImage(userFromDb.profileImg)); //if new image is recieved then remove old image
        }
        const resp = await User.findByIdAndUpdate(userId, {profileImg: undefined}, {new: true}).exec(); //update user profile and return updated profile
        return resp;
      }else{
        res.status(401).json({error:"user is not authorized to perform this action"});
      }
  } catch (error) {
      throw new Error(error.message);
  }
}


// function to delete old images of a post

const deleteOldImage = (image) => {
  if(image.includes('https')) return 'user had default profile image url';
    if (image) {
      fs.unlinkSync(`./uploads/${image}`); // remove old image from filesystem
      return ;
    }
};

// function to follow users
const follow = async(userId, user, res) => {
  try {
    const userToFollow = await User.findById(userId);
    if(!userToFollow){
      res.status(404).json({error: 'user not found'});
      return;
    }
    if(userToFollow.followers.includes(user._id)){
      res.status(400).json({message: 'You already follow this user'});
      return;
    }else{
      userToFollow.followers.push(user._id);
      const resp = await userToFollow.save();
      user.following.push(userToFollow._id);
      await user.save();
      resp.password = undefined;
      return resp;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

// function to un-follow users
const unFollow = async(userId, user, res) => {
  try {
    const userToUnFollow = await User.findById(userId);
    if(!userToUnFollow){
      res.status(404).json({error: 'user not found'});
      return;
    }
    if(userToUnFollow.followers.includes(user._id)){
      userToUnFollow.followers = userToUnFollow.followers.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
      const resp = await userToUnFollow.save();
      user.following = user.following.filter(
        (userId) => userId.toString()!== userToUnFollow._id.toString()
      );
      await user.save();
      resp.password =  undefined;
      return resp;
    }else{
      res.status(400).json({message: `You don't follow this user`});
      return;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
    getAllUsers,
    updateUserById,
    deleteUserById,
    findUserByEmail,
    deleteProfileImage,
    follow,
    unFollow
}