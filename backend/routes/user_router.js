const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js');
const protectedResource = require('../middleWare/protectedResources.js');
const upload = require("../middleWare/upload.js");


router.get('/', protectedResource, userController.getUserByJwt);
router.get('/get/all-user', protectedResource, userController.getAllUser);
router.get('/id/:id', protectedResource, userController.getUser);
router.put('/update/id/:userId', protectedResource, upload.single('profileImg'), userController.updateUserById);
router.put('/follow/:userId', protectedResource, userController.follow);
router.put('/unfollow/:userId', protectedResource, userController.unFollow);
router.delete('/delete/user/id/:id', protectedResource, userController.deleteUserById);
router.delete('/delete/profileImage/user/id/:id', protectedResource, userController.deleteProfileImage);



module.exports = router;