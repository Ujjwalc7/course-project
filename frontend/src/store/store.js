import { configureStore } from "@reduxjs/toolkit";
import tweetReducer from './slices/user/tweetSlice';
import authReducer from './slices/user/authSlice';

// configuration of redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
  },
});

export default store;