const Post = require("../models/post_model");
const fs = require('fs');

// function to create new post which takes the user data and post data as parameters
const createPost = async(body, user) => {
    try {
        user.password = undefined;
        const post = new Post({...body, author: user});
        const createdPost = await post.save();
        return createdPost; 
    } catch (error) {
        console.log('err');
        throw new Error(error);
    }
}

// function to get post by postId
const getPostById = async(id) => {
    try {
        const resp = await Post.findById(id).populate({path: 'author', select:'-password'});
        if(!resp){
            throw new Error('Post not found');
        }
        return resp;
    } catch (error) {
        throw new Error(error);
    }
}

// function to get all the posts and populate the author field

const getAllPost = async() => {
    try {
        const resp = await Post.find().populate({path: 'author', select:'-password'}).lean();
        if(!resp){
            throw new Error('Posts not found');
        }
        return resp;
    } catch (error) {
        throw new Error(error);
    }
}


// function to get all the posts of the logged in user and populate the author field

const getUserAllPost = async(user) => {
    try {
        const resp = await Post.find({author: user._id}).populate({path: 'author', select:'-password'}).lean();
        if(!resp){
            throw new Error('Posts not found');
        }
        return resp;
    } catch (error) {
        throw new Error(error);
    }
}


// function to delete the posts only by authorized user
const deletePostById = async(postId, user) => {
    try {
        const post = await Post.findById(postId).populate({path: 'author', select:'-password'});
        if(!post) {
            throw new Error('Post not found');
        }
        if(post.author._id.toString() === user._id.toString()){
            const resp = await Post.findByIdAndDelete(postId);
            return resp;
        }else{
            throw new Error('You are not authorized to delete this post');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


// function to update the post and delete old image of the post

const updatePostById = async(body, file) => {
    try {
        if(file){
            deleteOldImage(body.image);
            body.image = file.path.split('\\')[1];
            body.newImage = undefined;
        }
        const post = await Post.findByIdAndUpdate(body._id, body);
        return post;
    } catch (error) {
        throw new Error(error);
    }
}


// function to delete old images of a post

const deleteOldImage = (image) => {
    try {
        if(image){
            fs.unlinkSync(`./uploads/${image}`);
            return {message: "Image deleted successfully"}
        }else{
            throw new Error('Image not found')
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

// fuction to like posts

const likeUnlikePost = async(postId, user) => {
    try {
        const post = await Post.findById(postId);
        if(!post) {
            throw new Error('Post not found');
        }
        if(post.likes.includes(user._id)){
            post.likes = post.likes.filter(userId => userId !== user._id);
        }else{
            post.likes.push(user._id);
        }
        post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

module.exports = {
    createPost,
    updatePostById,
    deletePostById,
    getAllPost,
    getPostById,
    getUserAllPost,
    likeUnlikePost
}