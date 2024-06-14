import React, { useEffect, useState } from 'react'
import {baseUrl} from '../../../config/baseUrl';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { userTweetThunk } from '../../../store/slices/user/tweetSlice';
import TweetsCard from '../../components/tweets/TweetsCard';
import getTweetDetails from '../../../store/services/tweets/getTweetDetails';
import { useParams } from 'react-router-dom';
import getUserById from '../../../store/services/user/getUserById';
import getUserTweets from '../../../store/services/tweets/getUserTweets';

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

const UsersProfileDetails = () => {
  const [user, setUser] = useState(null);
  const [userTweets, setUserTweets] = useState(null);
  const [loading, setLoading] = useState(true);
  const jwt = localStorage.getItem('jwt');
  const {id} = useParams();

  const getUserAndTweets = async(id, jwt) =>{
    try {
      const user = await getUserById(id, jwt);
      const resp = await getUserTweets(id, jwt);
      setUser(user);
      setUserTweets(resp);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    getUserAndTweets(id, jwt);
  },[user])
  return !loading && (
    <div className='home-content w-full overflow-y-scroll h-[100vh]'>
      <div className='mt-[65px]'>
        <div className='w-full h-[250px] relative'>
          <div className='w-full h-[200px] absolute top-0 bg-blue-500'></div>
          <div className='px-4 flex justify-between absolute bottom-0 w-full z-[999]'>
            <div className='w-[100px] h-[100px] rounded-full overflow-hidden'>
              <img className='w-full h-full object-cover object-center' src={
                user?.profileImg.includes("https")
                  ? user?.profileImg
                  : baseUrl + 'uploads/' + user?.profileImg
              } alt="profile image" loading='lazy'/>
            </div>
            <div className='flex gap-3 items-end'>
              <button className='bg-blue-200/50 text-sm hover:bg-blue-200/100 active:opacity-80 p-1  border rounded-lg border-blue-300'>
                Update profile photo
              </button>
              <button className='bg-blue-200/50 text-sm hover:bg-blue-200/100 active:opacity-80 p-1  border rounded-lg border-blue-300'>
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className='w-full mt-3'>
          <div className='flex w-full flex-col px-4'>
            <p>{user.name}</p>
            <p>@{user.userName}</p>
          </div>
        </div>
        <div className='w-full mt-5 text-sm grid grid-cols-2 gap-4'>
          {user?.dateOfbirth && <div className='flex gap-1 items-center'>
            <DateRangeIcon style={{width:'18px'}}/>
            <p>Dob, {user?.dateOfbirth}</p>
          </div>}
          {user?.location &&<div className='flex gap-1'>
            <LocationOnIcon style={{width:'20px'}}/>
            <p>Location, {user?.location}</p>
          </div>}
          {user?.createdAt && <div className='flex gap-1'>
            <CalendarTodayIcon style={{width:'17px'}}/>
            <p>Joined, {formattedDate(user?.createdAt)}</p>
          </div>}
        </div>
        <div className='w-full mt-5 flex gap-4'>
          <p>{user.following.length} Following</p>
          <p>{user.followers.length} Followers</p>
        </div>
        <div className='w-full mt-5 font-robot text-center'>
          Tweets and Replies
        </div>
        <ul className='w-full mt-5'>
          {userTweets?.map(tweet => (
            <TweetsCard tweet={tweet}/>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UsersProfileDetails