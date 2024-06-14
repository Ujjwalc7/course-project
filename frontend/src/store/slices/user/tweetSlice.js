import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getAllTweets from "../../services/tweets/getAllTweets";
import getTweetDetails from "../../services/tweets/getTweetDetails";
import replyTweet from "../../services/tweets/replyTweet";
import getUserTweets from "../../services/tweets/getUserTweets";
import postTweet from "../../services/tweets/postTweet";

// async function to create new tweet
export const createTweetThunk = createAsyncThunk(
  "tweets/createTweetThunk",
  async ({formData, jwt}) => {
    const resp = await postTweet({formData, jwt});
    return resp;
  }
);

// async function to get all the tweets from DB
export const getAllTweetsThunk = createAsyncThunk(
  "tweets/getAllTweetsThunk",
  async (jwt) => {
    const resp = await getAllTweets(jwt);
    return resp;
  }
);

// async function to post a new tweet
export const getTweetDetailsThunk = createAsyncThunk(
  "tweets/getTweetDetailsThunk",
  async ({ id, jwt }) => {
    const resp = await getTweetDetails(id, jwt);
    return resp;
  }
);

// async function to get user's tweets
export const userTweetThunk = createAsyncThunk(
  "tweets/userTweetThunk",
  async ({userId, jwt}) => {
    const resp = await getUserTweets(userId, jwt);
    return resp;
  }
);

const intialState = {
  loading: false,
  tweets: [],
  tweet: null,
  error: null,
};

const tweetsSlice = createSlice({
  name: "tweets",
  initialState: intialState,
  reducers: {
    setLikeUnlike: (state, action) => {
      state.tweets = state.tweets.map((tweet) => {
        if (tweet._id === action.payload.id) {
          if (tweet.likes.includes(action.payload.userId)) {
            tweet.likes = tweet.likes.filter(
              (userId) => userId.toString() !== action.payload.userId.toString()
            );
          } else {
            tweet.likes.push(action.payload.userId);
          }
          return tweet;
        } else {
          return tweet;
        }
      });
    },
    setLikeUnlikeForSingleTweet: (state, action) => {
      if (state.tweet._id === action.payload.id) {
        if (state.tweet.likes.includes(action.payload.userId)) {
          state.tweet.likes = state.tweet.likes.filter(
            (userId) => userId.toString() !== action.payload.userId.toString()
          );
        } else {
          state.tweet.likes.push(action.payload.userId);
        }
      } else {
        return state.tweet;
      }
    },
    setLikeUnlikeForRepliedTweet: (state, action) => {
      console.log(action);
      state.tweet.replies = state.tweet.replies.map((reply) => {
        if (reply._id === action.payload.id) {
          if (reply.likes.includes(action.payload.userId)) {
            reply.likes = reply.likes.filter(
              (userId) => userId.toString() !== action.payload.userId.toString()
            );
          } else {
            reply.likes.push(action.payload.userId);
          }
          return reply;
        } else {
          return reply;
        }
      });
    },
    setRetweet: (state, action) => {
      let removed = false;
      state.tweets.map((tweet) => {
        if (tweet._id === action.payload.id) {
          if (tweet.retweetBy.length < 1) {
            tweet.retweetBy.push(action.payload.user);
            return;
          }
          tweet.retweetBy.map((user) => {
            if (user._id === action.payload.user._id) {
              tweet.retweetBy = tweet.retweetBy.filter(
                (user) => user._id !== action.payload.user._id
              );
              removed = true;
            }
          });
          if(removed) {
            return;
          }else{
            tweet.retweetBy.push(action.payload.user);
          }
        }
      });
    },
    setRetweetForSingleTweet: (state, action) => {
      let removed = false;
      if (state.tweet._id === action.payload.id) {
        if (state.tweet.retweetBy.length < 1) {
          state.tweet.retweetBy.push(action.payload.user);
          return;
        }
        state.tweet.retweetBy.map((user) => {
          if (user._id === action.payload.user._id) {
            state.tweet.retweetBy = state.tweet.retweetBy.filter(
              (user) => user._id !== action.payload.user._id
            );
            removed = true;
          }
        });
        if (removed) {
          return;
        } else {
          state.tweet.retweetBy.push(action.payload.user);
        }
      }
    },
    setRetweetForRepliedTweet: (state, action) => {
      let removed = false;
      state.tweet.replies.map((reply) => {
        if (reply._id === action.payload.id) {
          if (reply.retweetBy.length < 1) {
            reply.retweetBy.push(action.payload.user);
            return;
          }
          reply.retweetBy.map((user) => {
            if (user._id === action.payload.user._id) {
              reply.retweetBy = reply.retweetBy.filter(
                (user) => user._id !== action.payload.user._id
              );
              removed = true;
            }
          });
          if (removed) {
            return;
          } else {
            reply.retweetBy.push(action.payload.user);
          }
        }
      });
    },
    setReplyToTweet: (state, action) => {
      if(state.tweet._id === action.payload.tweetId) {
        state.tweet.replies.push(action.payload.resp);
      }else{
        state.tweet.replies.map(tweet => {
          if(tweet._id === action.payload.tweetId) {
              tweet.replies.push(action.payload.resp);
          }
        })
      }
    },
    setReplyToTweets: (state, action) => {
      state.tweets.map(tweet => {
        if(tweet._id === action.payload.tweetId) {
          tweet.replies.push(action.payload.resp);
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTweetThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTweetThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.tweets.unshift(action.payload);
      state.error = null;
    })
    .addCase(createTweetThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
      .addCase(getAllTweetsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTweetsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
        state.error = null;
      })
      .addCase(getAllTweetsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getTweetDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTweetDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tweet = action.payload;
        state.error = null;
      })
      .addCase(getTweetDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(userTweetThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userTweetThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload;
        state.error = null;
      })
      .addCase(userTweetThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setLikeUnlike,
  setLikeUnlikeForSingleTweet,
  setLikeUnlikeForRepliedTweet,
  setRetweet,
  setRetweetForRepliedTweet,
  setRetweetForSingleTweet,
  setReplyToTweet,
  setReplyToTweets
} = tweetsSlice.actions;

export default tweetsSlice.reducer;
