const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    comment:{
        type: String,
        required: true
    },
    commentedAt:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    replies:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments'
        }
    ]
}, {timestamps: true});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;