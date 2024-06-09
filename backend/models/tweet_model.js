const mongoose = require("mongoose");

// tweet schema

const TweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    retweetBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tweets",
      },
    ],
  },
  { timestamps: true }
);

const Tweet = mongoose.model("tweets", TweetSchema);

module.exports = Tweet;
