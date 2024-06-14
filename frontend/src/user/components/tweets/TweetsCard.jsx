import React from "react";
import "./style.css";
import { baseUrl } from "../../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLikeUnlike,
  setLikeUnlikeForRepliedTweet,
  setLikeUnlikeForSingleTweet,
  setRetweet,
  setRetweetForRepliedTweet,
  setRetweetForSingleTweet,
} from "../../../store/slices/user/tweetSlice";
import TweetBox from "../tweet box/TweetBox";
import likeUnlikeTweet from "../../../store/services/tweets/likeUnlikeTweet";
import FavoriteIcon from "@mui/icons-material/Favorite";
import reTweet from "../../../store/services/tweets/reTweet";

const formattedDate = (createdAt) => {
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-US", options);
};

const TweetsCard = ({ tweet }) => {
  const { tweetId } = useParams();
  const [open, setOpen] = React.useState(false);
  const LoggedInUser = useSelector((state) => state.auth.LoggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenOrClose = () => {
    setOpen((prev) => !prev);
  };

  const jwt = localStorage.getItem("jwt");

  const handleLike = async (tweet) => {
    try {
      const resp = await likeUnlikeTweet(tweet._id, jwt);

      ///if there is tweet id from useParams then dispatch like unlike function for single tweet state
      if (tweetId) {
        // if the tweet has replies then dispatch like unlike function for those tweets
        if (tweetId !== tweet._id) {
          dispatch(
            setLikeUnlikeForRepliedTweet({ id: tweet._id, userId: LoggedInUser._id })
          );
          return;
        }
        // like unlike dispatch function for single tweet state
        dispatch(
          setLikeUnlikeForSingleTweet({ id: resp._id, userId: LoggedInUser._id })
        );
        return;
      }
      ///if there is no tweet id from useParams then dispatch like unlike function for tweets array state
      if (resp._id) {
        dispatch(setLikeUnlike({ id: resp._id, userId: LoggedInUser._id }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = (tweet) => {
    handleOpenOrClose();
    // dispatch(replyTweetThunk({postId: tweet._id, jwt}))
  };

  const handleRetweet = async(tweet) => {
    try {
      const resp = await reTweet(tweet._id, jwt);

      ///if there is tweet id from useParams then dispatch retweet function for single tweet state
      if (tweetId) {
        // if the tweet has replies then dispatch retweet function for those tweets
        if (tweetId !== tweet._id) {
          dispatch(
            setRetweetForRepliedTweet({ id: tweet._id, user: LoggedInUser})
          );
          return;
        }
        // retweet dispatch function for single tweet state
        dispatch(
          setRetweetForSingleTweet({ id: resp._id, user: LoggedInUser})
        );
        return;
      }
      ///if there is no tweet id from useParams then dispatch retweet function for tweets array state
      if (resp._id) {
        dispatch(setRetweet({ id: resp._id, user: LoggedInUser}));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="list-none border border-gray-300">
      {tweet.retweetBy?.[0]?.userName && (
        <p className="flex gap-1 items-center pl-12 m-0 text-sm">
          <FontAwesomeIcon
            icon={faRetweet}
            style={{ color: "gray", width: "15px", height: "15px" }}
          />
          Retweeted by {tweet.retweetBy?.[tweet.retweetBy.length-1]?.userName}
        </p>
      )}
      <div className="flex gap-1 p-2 ">
        <div className="w-[45px] h-[45px] rounded-full overflow-hidden cursor-pointer">
          {
            <img
              className="object-cover object-center w-full h-full"
              src={
                tweet.author.profileImg.includes("https")
                  ? tweet.author.profileImg
                  : baseUrl + "uploads/" + tweet.author.profileImg
              }
              alt="profile image"
              loading="lazy" 
              onClick={()=>navigate(`/profile/${tweet.author._id}`)}
            />
          }
        </div>
        <div className="flex flex-col w-full">
          <p>
            @<Link to={`/profile/${tweet.author._id}`} className="hover:underline cursor-pointer">{tweet.author.userName}</Link> - {formattedDate(tweet.createdAt)}
          </p>
          <p
            className="cursor-pointer"
            onClick={() => navigate(`/tweet/details/id/${tweet._id}`)}
          >
            {tweet.content}
          </p>
          {tweet.image && (
            <Link
              to={`/tweet/details/id/${tweet._id}`}
              className="w-full mt-1 cursor-pointer overflow-hidden rounded-2xl flex justify-center h-[300px] border border-gray-300 bg-gray-200"
            >
              <img
                className="w-full h-full object-contain object-center"
                src={baseUrl + "uploads/" + tweet.image}
                alt="tweet image"
                loading="lazy"
              />
            </Link>
          )}
          <div className="flex gap-[50px] pl-4 pt-2 items-center">
            <div className="relative w-[23px] h-[23px]">
              {tweet.likes.includes(LoggedInUser?._id) ? (
                <FavoriteIcon 
                className="cursor-pointer"
                style={{ color: "red", width: "23px", height: "23px", display: "block", position: "absolute", top:"-2px", left:"-1px" }}
                onClick={() => handleLike(tweet)}/>
              ) : (
                <FontAwesomeIcon
                  icon={faHeart}
                  className="cursor-pointer"
                  style={{ color: "red", width: "20px", height: "20px" }}
                  onClick={() => handleLike(tweet)}
                />
              )}
              {tweet.likes.length > 0 && (
                <span className="absolute bottom-0 -right-[6px]">{tweet.likes.length}</span>
              )}
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faComment}
                className="cursor-pointer"
                style={{ color: "#38bed6", width: "20px", height: "20px" }}
                onClick={handleReply}
              />
              {tweet.replies.length > 0 && (
                <span className="absolute">{tweet.replies.length}</span>
              )}
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faRetweet}
                className="cursor-pointer"
                style={{ color: "green", width: "20px", height: "20px" }}
                onClick={()=>handleRetweet(tweet)}
              />
              {tweet.retweetBy.length > 0 && (
                <span className="absolute">{tweet.retweetBy.length}</span>
              )}
            </div>
          </div>
        </div>

        <TweetBox
          postId={tweet._id}
          open={open}
          handleOpenOrClose={handleOpenOrClose}
        />
      </div>
    </li>
  );
};

export default TweetsCard;
