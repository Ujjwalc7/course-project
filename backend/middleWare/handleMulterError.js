const multer = require('multer');

const multerErrorHandler = (err, req, res, next)=>{
    if(err.message){
        return res.status(400).json({error: err.message});
    }else {
        return res.status(500).json({error: 'Internal Server Error'})
    }
    next();
}

module.exports = multerErrorHandler;