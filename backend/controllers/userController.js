const userService = require('../services/user_service');
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwtProvider = require('../config/jwtProvider');

// funtion for user sign up
const createUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "one or more feilds are empty" });
      }
      const userFound = await User.findOne({ email: email });
      if (userFound) {
        return res
          .status(500)
          .json({ error: "user with this email already exists" });
      }
      const hashPassword = await bcrypt.hash(password, 12); //hashing password using bycrypt algorithm to avoid password leaking
      const newUser = new User({ ...req.body, password: hashPassword });
      const user = await newUser.save();
      user.password = undefined;
      const jwt = jwtProvider.genrateToken(user._id); //generate jwt token using jsonwebtoken by passing the userID
      return res.status(201).json({ user: user, token: jwt });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // function for user login
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "one or more feilds are empty" });
      }
      const userFound = await User.findOne({ email: email });
      if (!userFound) {
        return res.status(401).json({ message: "User Not Found" });
      }
      const didMatch = await bcrypt.compare(password, userFound.password); // compare password sent by user and the user password data stored in database
      if (!didMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const jswToken = jwtProvider.genrateToken(userFound._id); //generate jwt token using jsonwebtoken by passing the userID
      userFound.password = undefined;
      return res.status(200).json({token: jswToken, user: userFound });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };


  // function to get user details
const getUser = async(req, res) => {
  const id = req.params.id;
 
    try {
      const user = await User.findById(id);
      if(!user){
        throw new Error("User not found");
      }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

//function to get all users details

const getAllUser = async(req, res) => {
    try {
        const reap = await userService.getAllUsers();
        res.status(200).json(reap);
    } catch (error) {
        console.log('err');
        res.status(500).json(error);
    }
}

//function to delete user details by user id

const deleteUserById = async(req, res) => {
    const id = req.params.id;
    try {
        const resp  = await userService.deleteUserById(id);
        res.status(200).json(error);
    } catch (error) {
        console.log('err');
        res.status(500).json(error);
    }
}


//function to update user details by user id

const updateUserById = async(req, res) => {
    const id = req.params.id;
    try {
        const resp = await userService.updateUserById(id)
        res.status(200).json(error);
    } catch (error) {
        console.log('err');
        res.status(500).json(error);
    }
}

module.exports = {
    createUser,
    updateUserById,
    deleteUserById,
    getAllUser,
    getUser,
    login
}