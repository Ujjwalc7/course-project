const postService = require('../services/post_service');

const createPost = async(req, res) => {
    try {
        if(req.file){
            req.body.image = req.file.path.split('\\')[1];
        }
        const resp = await postService.createPost({...req.body}, req.user, res);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({error: error.message || "Something went wrong"});
    }
}

const getPostById = async(req, res) => {
    const id = req.params.id;
    try {
        const resp = await postService.getPostById(id, res);
        if(resp){
            res.status(200).json(resp);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

const getAllPost = async(req, res) => {
    try {
        const resp = await postService.getAllPost(res);
        if(resp){
            res.status(200).json(resp);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

const getUserAllPost = async(req, res) => {
    const id = req.params.id;
    try {
        const resp = await postService.getUserAllPost(id);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

const deletePostById = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        const resp = await postService.deletePostById(postId, user, res);
        if(resp){
            res.status(200).json({message: 'post deleted successfully'});
        }
        // return resp;
    } catch (error) {
        // console.log(error.message.);
        res.status(500).json(error.message);
    }
}

// const updatePostById = async(req, res) => {
//     try {
//         const resp = await postService.updatePostById(req.body, req.file, res);
//         res.status(200).json(resp);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json(error.message);
//     }
// }

// fuction to like posts

const likeUnlikePost = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        const resp = await postService.likeUnlikePost(postId, user, res);
        if(resp){
            res.status(200).json(resp);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


// fuction to add comments on posts

const postReply = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        if(req.file){
            req.body.image = req.file.path.split('\\')[1];
        }
        const resp = await postService.postReply(postId, req.body, user, res);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}

// function to retweet or cancel a retweet
 
const reTweet = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        const resp = await postService.reTweet(postId, user, res);
        if(resp){
            res.status(200).json(resp);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
}


module.exports = {
    createPost,
    // updatePostById,
    deletePostById,
    getAllPost,
    getPostById,
    getUserAllPost,
    likeUnlikePost,
    postReply,
    reTweet
}