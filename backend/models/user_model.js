const mongoose = require('mongoose');


// users schema

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userName:{
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
        default: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
    },
    dateOfbirth:{
        type: Date,
    },
    location:{
        type: String,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
}, {timestamps: true});

const User = mongoose.model('users', UserSchema);

module.exports = User;