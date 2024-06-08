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


require('./models/post_model');
require('./models/user_model');

app.use(cors());
app.use(express.json());


//all apis to interact with client
app.use('/api/user', require('./routes/user_router'));
app.use('/api/post', require('./routes/post_router'));


app.listen(PORT,()=>console.log(`Server listening on port: `+PORT));

