const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const protectedResource = require('../middleWare/protectedResources');
const upload = require('../middleWare/upload');

// protecting the api with protectedResource middleware

router.post('/create', protectedResource, upload.single('image'), postController.createPost);
router.get('/get/all-post', postController.getAllPost);
router.get('/get/post/id/:id', protectedResource, postController.getPostById);
router.get('/get/user/all-post', protectedResource, postController.getUserAllPost);
router.put('/update/post', protectedResource, postController.updatePostById);
router.delete('/delete/post/id/:id', protectedResource, postController.deletePostById);
router.put('/likes/post/id/:id', protectedResource, postController.likeUnlikePost);



module.exports = router;