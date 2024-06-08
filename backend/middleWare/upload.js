const express = require("express");
const router = express.Router();
const multer = require("multer");

//  configuring storage to store images
const storage  = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
});

// configuring multer to set storage, size limit and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
     fileFilter: (req,file,cb)=>{
        const {description, location} = req.body;
        if(!description, !location){
            return;
        }
         if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
             cb(null,true);
         }else{
            cb(null,false);
            return;
         }
     }
})

module.exports = upload;