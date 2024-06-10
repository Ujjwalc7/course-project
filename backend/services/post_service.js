const Comment = require("../models/comment_model");
const Tweet = require("../models/tweet_model");
const fs = require("fs");

// function to create new post which takes the user data and post data as parameters
const createPost = async (body, user, res) => {
  try {
    user.password = undefined;
    const post = new Tweet({ ...body, author: user });
    const createdPost = await post.save();
    return createdPost;
  } catch (error) {
    console.log("err");
    throw new Error(error);
  }
};

// function to get post by postId
const getPostById = async (id, res) => {
  try {
    const resp = await Tweet.findById(id)
      .populate("author", "userName profileImg") //populate post owner
      .populate({path:"replies", populate: {path: 'author', select: "userName profileImg"}}) // populate post replies and authors of replied tweets
      .exec();
    if (!resp) {
      res.status(404).json("Post not found");
      return;
    }
    return resp;
  } catch (error) {
    throw new Error(error);
  }
};

// function to get all the posts and populate the author field

const getAllPost = async (res) => {
  try {
    const resp = await Tweet.find()
      .populate("author", "userName profileImg")
      .exec(); //populate post owner
    if (!resp) {
      res.status(404).json("Post not found");
      return;
    }
    return resp;
  } catch (error) {
    throw new Error(error);
  }
};

// function to get all the posts of the logged in user and populate the author field

const getUserAllPost = async (user) => {
  try {
    const resp = await Tweet.find({$or: [{author: user._id}, {replies: user._id}] })
      .populate("author", "userName profileImg") //populate post owner
      .exec();
    if (!resp) {
      throw new Error("Posts not found");
    }
    return resp;
  } catch (error) {
    throw new Error(error);
  }
};

// function to delete the posts only by authorized user
const deletePostById = async (postId, user, res) => {
  try {
    const post = await Tweet.findById(postId).populate({
      //populates user details
      path: "author",
      select: "-password",
    });
    if (!post) {
      res.status(404).json("No post found!");
      return;
    }
    // delete the tweet only if the user is authorized
    if (post.author._id.toString() === user._id.toString()) {
      if(post.image){
        deleteOldImage(post.image);  //If the tweet has an image, delete it
      }
      const resp = await Tweet.findByIdAndDelete(postId);
      return resp;
    } else {
      res.status(400).json("You are not authorized to delete this post");
      return;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// function to delete old images of a post

const deleteOldImage = (image) => {
  try {
    if (image) {
      fs.unlinkSync(`./uploads/${image}`); // remove old image from filesystem
      return { message: "Image deleted successfully" };
    } else {
      throw new Error("Image not found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


// function to update the post and delete old image of the post

// const updatePostById = async (body, file, res) => {
//   try {
//     if (file) {
//       deleteOldImage(body.image);
//       body.image = file.path.split("\\")[1]; // setting updated image to the tweet
//       body.newImage = undefined;
//     }
//     const post = await Tweet.findByIdAndUpdate(body._id, body, {new: true}); // returning updated document
//     return post;
//   } catch (error) {
//     throw new Error(error);
//   }
// };



// fuction to like posts

const likeUnlikePost = async (postId, user, res) => {
  try {
    const post = await Tweet.findById(postId);
    if (!post) {
      res.status(404).json("Post not found");
      return;
    }
    // if(userId already present in likes of a post then remove it or else add user id to like)
    if (post.likes.includes(user._id)) {
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
    } else {
      post.likes.push(user._id);
    }
    await post.save();
    return post;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

// fuction to add reply on posts

const postReply = async (postId, body, user, res) => {
  try {
    user.password = undefined;
    // creating new tweet
    const newPost = new Tweet({ ...body, author: user });
    const createdPost = await newPost.save();
    const post = await Tweet.findByIdAndUpdate(
      postId,
      {
        $push: { replies: createdPost },
      },
      { new: true } // To return the updated document
    ); // finding the tweet by id sent from the client
    return post;
  } catch (error) {
    throw new Error(error.message);
  }
};

// function to retweet or cancel a retweet

const reTweet = async(postId, user, res) => {
  try {
    const tweet = await Tweet.findById(postId);
    if(!tweet) {
      res.status(404).json("Post not found");
      return;
    }
    if(tweet.retweetBy.includes(user._id)){
      tweet.retweetBy = tweet.retweetBy.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
    }else{
      tweet.retweetBy.push(user._id);
    }
    return await tweet.save();
  } catch (error) {
      console.log(error);
      throw new Error(error.message);
  }
}

module.exports = {
  createPost,
  // updatePostById,
  deletePostById,
  getAllPost,
  getPostById,
  getUserAllPost,
  likeUnlikePost,
  postReply,
  reTweet
};
