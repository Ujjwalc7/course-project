import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getTweetDetailsThunk } from '../../../store/slices/user/tweetSlice';
import TweetsCard from '../../components/tweets/TweetsCard';
import './style.css'


const TweetDetails = () => {
    const tweet = useSelector(state=>state.tweets.tweet);
    const {tweetId} = useParams();
    const jwt = localStorage.getItem('jwt');
    const navigate = useNavigate();
    const dispatch = useDispatch();



    useEffect(()=>{
        dispatch(getTweetDetailsThunk({id: tweetId, jwt: jwt}));
    },[tweetId, navigate])


  return tweet && (
    <div className='tweet-content w-full overflow-y-scroll h-[100vh]'>
        <div className='mt-[65px]'>
        <TweetsCard tweet={tweet}/>
        {tweet.replies.length > 0 && <p className='my-2'>Replies</p>}
        <ul>
            {tweet.replies.length > 0 ? (
                tweet.replies.map(reply=>(
                    <TweetsCard tweet={reply} key={reply._id}/>
                ))
            ) : null}
        </ul>
        </div>
    </div>
  )
}

export default TweetDetails