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
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;