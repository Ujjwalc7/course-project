import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./user/components/navbar/Navbar";
import {Routes, Route, useNavigate } from "react-router-dom";
import Home from "./user/pages/home/Home";
import TopNavbar from "./user/components/TopNavbar";
import Tweet from "./user/pages/profile page/ProfileDetails";
import getUserByJwt from "./store/services/user/getUserByJwt";
import AuthLayout from "./user/components/AuthLayout";
import { useDispatch } from "react-redux";
import { logout, setUser } from "./store/slices/user/authSlice";
import Login from "./user/pages/login/Login";
import Signup from "./user/pages/signup/Signup";
import OtherRoutes from "./user/components/OtherRoutes";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUser = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      if (jwt) {
        const resp = await getUserByJwt(jwt);
      if (resp) {
        dispatch(setUser(resp));
        // navigate('/');
        setLoading(false);
      }
      } else {
        localStorage.removeItem("jwt");
        dispatch(logout());
        setLoading(false);
      }
    } catch (error) {
        console.log(error);
        localStorage.removeItem("jwt");
        dispatch(logout());
        setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return !loading && (
    <main className="h-[100vh] m-auto overflow-y-hidden max-w-[1536px]">
    <Routes>
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />
      <Route path="/*" element={<OtherRoutes/>} />
    </Routes>
    </main>
  );
}

export default App;
