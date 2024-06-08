require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // jwt secret string to verify user's access token
const mongoose = require('mongoose');
const User = require('../models/user_model');


// middleware for making the rest api secure and accessible to only the authenticated users
module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error:"user not logged in"});
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if(err){
            return res.status(401).json({error:"user not logged in"}); 
        }
        const {userId} = payload;
        const user = await User.findById(userId);
        if(user){
            req.user = user;
            next();
        }
    });
};