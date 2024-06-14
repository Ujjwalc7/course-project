import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TweetBox from "./tweet box/TweetBox";

const TopNavbar = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleOpenOrClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
    <div className="bg-white w-full absolute py-4 flex justify-between z-[1000] top-0">
      <div >
        <div className="font-robot px-2 ">
          {location.pathname === '/' && 'Home'}
          {location.pathname === '/profile' && 'Profile'}
          {location.pathname.includes('/tweet') && 'Tweets'}
        </div>
      </div>
        <button className="font-robot px-4 py-1 bg-blue-300 hover:bg-blue-400 transition-all rounded-2xl" onClick={handleOpenOrClose}>
          Tweet
        </button>
    </div>
    <TweetBox open={open} handleOpenOrClose={handleOpenOrClose}/>
    </>
  );
};

export default TopNavbar;
