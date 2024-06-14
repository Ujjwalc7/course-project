const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI; //secret uri to connect mongodb

mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', ()=>{
    console.log('connected');
})

mongoose.connection.on('error', ()=>{
    console.log('not connected');
})


require('./models/tweet_model');
require('./models/user_model');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//all APIs to interact with client
app.use('/api/auth', require('./routes/auth_router'));
app.use('/api/user', require('./routes/user_router'));
app.use('/api/post', require('./routes/post_router'));


// middleware to handle error when occurred during handling image files
app.use(require('./middleWare/handleMulterError'))


app.listen(PORT,()=>console.log(`Server listening on port: `+PORT));

