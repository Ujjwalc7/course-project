import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../config/baseUrl";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { userTweetThunk } from "../../../store/slices/user/tweetSlice";
import TweetsCard from "../../components/tweets/TweetsCard";
import { useParams } from "react-router-dom";
import { getUserByIdThunk, setFollowing, setUnfollowing } from "../../../store/slices/user/authSlice";
import followUser from "../../../store/services/user/followUser";
import unfollowUser from "../../../store/services/user/unfollowUser";
import AddProfilePhotoForm from "../../components/AddProfilePhotoForm";
import UpdateProfileForm from "../../components/UpdateProfileForm";

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

const ProfileDetails = () => {
  const [open, setOpen] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const LoggedInUser = useSelector((state) => state.auth.LoggedInUser);
  const userTweets = useSelector((state) => state.tweets.tweets);
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");


  const handleOpenOrClose = () => {
    setOpen((prev) => !prev);
  };

  const openCloseUpdateForm = () => {
    setOpenUpdateForm((prev) => !prev);
  };

  const handleFollowUser = async (userDetails) => {
    try {
      const resp = await followUser(userDetails, jwt);
      if(resp){
        dispatch(setFollowing(userDetails._id))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollowUser = async (userDetails) => {
    try {
      const resp = await unfollowUser(userDetails, jwt);
      if(resp){
        dispatch(setUnfollowing(userDetails._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getUserByIdThunk({ userId: id, jwt: jwt }));
    dispatch(userTweetThunk({ userId: id, jwt: jwt }));
  }, [id]);
  return (
    userDetails && (
      <div className="home-content w-full overflow-y-scroll h-[100vh]">
        <div className="mt-[65px]">
          <div className="w-full h-[250px] relative">
            <div className="w-full h-[200px] absolute top-0 bg-blue-500"></div>
            <div className="px-4 flex justify-between absolute bottom-0 w-full z-[999]">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center"
                  src={
                    userDetails?.profileImg.includes("https")
                      ? userDetails?.profileImg
                      : baseUrl + "uploads/" + userDetails?.profileImg
                  }
                  alt="profile image"
                  loading="lazy"
                />
              </div>
              {LoggedInUser._id === id && (
                <div className="flex gap-3 items-end">
                  <button onClick={handleOpenOrClose} className="bg-blue-200/50 text-sm hover:bg-blue-200/100 active:opacity-80 p-1  border rounded-lg border-blue-300">
                    Update profile photo
                  </button>
                  <button onClick={openCloseUpdateForm} className="bg-blue-200/50 text-sm hover:bg-blue-200/100 active:opacity-80 p-1  border rounded-lg border-blue-300">
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mt-3">
            <div className="flex w-full flex-col px-4">
              <p>{userDetails.name}</p>
              <p>@{userDetails.userName}</p>
            </div>
          </div>
          <div className="w-full mt-5 text-sm grid grid-cols-2 gap-4">
            {userDetails?.dateOfbirth && (
              <div className="flex gap-1 items-center">
                <DateRangeIcon style={{ width: "18px" }} />
                <p>Dob, {userDetails?.dateOfbirth}</p>
              </div>
            )}
            {userDetails?.location && (
              <div className="flex gap-1">
                <LocationOnIcon style={{ width: "20px" }} />
                <p>Location, {userDetails?.location}</p>
              </div>
            )}
            {userDetails?.createdAt && (
              <div className="flex gap-1">
                <CalendarTodayIcon style={{ width: "17px" }} />
                <p>Joined, {formattedDate(userDetails?.createdAt)}</p>
              </div>
            )}
          </div>
          <div className="w-full mt-5 flex gap-4 justify-between">
            <div className="flex gap-4 items-center">
              <p>{userDetails.following.length} Following</p>
              <p>{userDetails.followers.length} Followers</p>
            </div>
            {LoggedInUser._id !== id ? (userDetails.followers.includes(LoggedInUser._id) ? (
              <button
                className="text-white font-robot px-4 py-1 bg-black hover:bg-gray-800 active:bg-black transition-all rounded-2xl"
                onClick={() => handleUnfollowUser(userDetails)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="text-white font-robot px-4 py-1 bg-black hover:bg-gray-800 active:bg-black transition-all rounded-2xl"
                onClick={() => handleFollowUser(userDetails)}
              >
                Follow
              </button>
            )) : null}
          </div>
          <div className="w-full mt-5 font-robot text-center">
            Tweets and Replies
          </div>
          <ul className="w-full mt-5">
            {userTweets?.map((tweet) => (
              <TweetsCard tweet={tweet} key={tweet._id} />
            ))}
          </ul>
        </div>
        <AddProfilePhotoForm handleOpenOrClose={handleOpenOrClose} open={open}/>
        <UpdateProfileForm openCloseUpdateForm={openCloseUpdateForm} openUpdateForm={openUpdateForm}/>
      </div>
    )
  );
};

export default ProfileDetails;
