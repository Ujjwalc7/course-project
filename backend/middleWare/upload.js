const multer = require("multer");

//  configuring storage to store images
const storage  = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        const filename = file.originalname.split(" ").join("");
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9);
        const fileExtention= filename.split('.').pop();
        cb(null,filename.split('.')[0]+'-'+uniqueSuffix+'.'+fileExtention);
    }
});

// configuring multer to set storage, size limit and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
     fileFilter: (req,file,cb)=>{
        if(req.params.userId){
            if(req.user._id.toString() !== req.params.userId.toString()){
                cb(new Error('user is not authorized to perform this action'),false);
                return;
            }
        }
         if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
             cb(null,true);
         }else{
            cb(new Error('only image files are allowed'),false);
            return;
         }
     }
})

module.exports = upload;