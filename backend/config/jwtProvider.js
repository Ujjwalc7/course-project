require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");


// generate jsonwebtoken by passing user id and secretkey and setting expiration time
const genrateToken = (userId) =>{
    const token = jwt.sign({userId}, SECRET_KEY,{expiresIn:"25m"});
    return token;
}


module.exports = {genrateToken}