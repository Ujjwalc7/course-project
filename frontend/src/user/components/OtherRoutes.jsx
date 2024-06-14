import React from "react";
import { Routes, Route } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Navbar from "./navbar/Navbar";
import AuthLayout from "./AuthLayout";
import Home from "../pages/home/Home";
import TweetDetails from "../pages/tweet details/TweetDetails";
import ProfileDetails from "../pages/profile page/ProfileDetails";
import UsersProfileDetails from "../pages/profile page/UsersProfileDetails";


const OtherRoutes = () => {
  return (
    
    <div className="content-div relative w-[620px] m-auto h-[100vh]">
      <TopNavbar />
      {/* navbar */}
      <Navbar />
      {/* routes */}
      <Routes>
      <Route
        path="/"
        element={
          <AuthLayout authentication={true}>
            <Home />
          </AuthLayout>
        }
      />
      {/* loggedIn user profile details page route */}
      <Route
        path="/profile/:id"
        element={
          <AuthLayout authentication={true}>
            <ProfileDetails /> /
          </AuthLayout>
        }
      />
      {/* tweet datails page route */}
      <Route
        path="/tweet/details/id/:tweetId"
        element={
          <AuthLayout authentication={true}>
            <TweetDetails />
          </AuthLayout>
        }
      />
      {/* other users profile details page route */}
      {/* <Route
        path="/:userName/profile/:id"
        element={
          <AuthLayout authentication={true}>
            <UsersProfileDetails /> /
          </AuthLayout>
        }
      /> */}
      </Routes>
    </div>
  )
}

export default OtherRoutes

