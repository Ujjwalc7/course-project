const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js');
const protectedResource = require('../middleWare/protectedResources.js');
const upload = require("../middleWare/upload.js");


router.get('/get/all-user', protectedResource, userController.getAllUser);
router.get('/get/user/id/:id', protectedResource, userController.getUser);
router.put('/update/user/id/:id', protectedResource, upload.single('profileImg'), userController.updateUserById);
router.delete('/delete/user/id/:id', protectedResource, userController.deleteUserById);


module.exports = router;