const mongoose = require('mongoose');


// users schema

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profileImg:{
        type: String,
    }
}, {timestamps: true});

const User = mongoose.model('users', UserSchema);

module.exports = User;