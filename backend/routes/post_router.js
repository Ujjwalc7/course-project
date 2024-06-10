const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const protectedResource = require('../middleWare/protectedResources');
const upload = require('../middleWare/upload');

// protecting the api with protectedResource middleware

router.post('/create', protectedResource, upload.single('image'), postController.createPost);
router.get('/get/all-post', postController.getAllPost);
router.get('/get/user/all-post', protectedResource, postController.getUserAllPost);
// router.put('/update/post', protectedResource, postController.updatePostById);
router.put('/id/:id/reply', protectedResource, upload.single('image'), postController.postReply);
router.put('/retweet/:id/', protectedResource, upload.single('image'), postController.reTweet);
router.get('/get/post/id/:id', protectedResource, postController.getPostById);
router.put('/likes/id/:id', protectedResource, postController.likeUnlikePost);
router.delete('/delete/post/id/:id', protectedResource, postController.deletePostById);



module.exports = router;