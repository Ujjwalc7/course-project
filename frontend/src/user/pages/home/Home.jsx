import React, { useEffect } from 'react'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTweetsThunk } from '../../../store/slices/user/tweetSlice'
import TweetsCard from '../../components/tweets/TweetsCard'


const Home = () => {
    const tweets = useSelector(state=>state.tweets.tweets);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');

    // calling the dispatch function to get all the tweets whenever the component is mounted
    useEffect(()=>{
        dispatch(getAllTweetsThunk(jwt));
    },[])
  return (
    <div className='home-content w-full overflow-y-scroll h-[100vh]'>
      <ul className='mt-[65px]'>
        {tweets.map(tweet=>(
          <TweetsCard tweet={tweet} key={tweet._id}/>  //tweet cards component
          ))}
        </ul>
    </div>
  )
}

export default Home