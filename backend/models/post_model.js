const mongoose = require('mongoose');


// posts schema

const PostSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    comments:[
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'comments'
        }
    ]
});

const Post = mongoose.model('posts', PostSchema);

module.exports = Post;