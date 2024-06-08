const upload = require('../middleWare/upload');
const postService = require('../services/post_service');

const createPost = async(req, res) => {
    const {description, location} = req.body;
    try {
        if(!description || !location) {
            throw new Error('All fields are required');
        }
        if(!req.file){
            throw new Error('Not supported file type / missing image file');
        }
        const image = req.file.path.split('\\')[1];
        const resp = await postService.createPost({...req.body, image: image}, req.user);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({error: error.message || "Something went wrong"});
    }
}

const getPostById = async(req, res) => {
    const id = req.params.id;
    try {
        const resp = await postService.getPostById(id);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

const getAllPost = async(req, res) => {
    try {
        const resp = await postService.getAllPost();
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

const getUserAllPost = async(req, res) => {
    const user = req.user;
    try {
        const resp = await postService.getUserAllPost(user);
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
        const resp = await postService.deletePostById(postId, user);
        res.status(200).json({message: 'post deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
    }
}

const updatePostById = async(req, res) => {
    try {
        const resp = await postService.updatePostById(req.body, req.file);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}

// fuction to like posts

const likeUnlikePost = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        const resp = await postService.likeUnlikePost(postId, user);
        res.status(200).json(resp);
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
}


// fuction to add comments on posts

const postComment = async(req, res) => {
    const postId = req.params.id;
    const user = req.user;
    try {
        const resp = await postService.postComment(postId, req.body, user, res);
        res.status(200).json(resp);
    } catch (error) {
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
    likeUnlikePost,
    postComment
}