import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import logo from "/twittie.jpg";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/user/authSlice";
import { baseUrl } from "../../../config/baseUrl";

const navLinks = [
  { text: "Home", icon: <HomeIcon />, link: '/' },
  { text: "Profile", icon: <PersonIcon />, link: 'profile' },
  { text: "Logout", icon: <LogoutIcon />, link: 'logout' },
];

const Navbar = () => {
  const LoggedInUser = useSelector(state=>state.auth.LoggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleNavigate = (link) =>{
    if(link === 'logout'){
      localStorage.removeItem("jwt");
      dispatch(logout());
      navigate('/login');
    }else if(link === 'profile'){
      navigate('/profile/'+LoggedInUser._id);
    }else{
      navigate('/');
    }
  }

  return (
    <div className="absolute flex flex-col h-[100vh] bg-white w-[375px] left-[-375px]">
      <div className="w-full flex justify-center mt-3">
        <img src={logo} alt="logo" className="w-[35px]" />
      </div>
      <ul className="w-full mt-1 roboto-medium">
        {navLinks.map((link, index) => (
          <li
            key={index}
            className="w-full flex items-center justify-center px-2 "
          >
            <div onClick={()=>handleNavigate(link.link)} className="flex gap-1 w-[150px] rounded-full items-center py-2 cursor-pointer hover:bg-blue-200 justify-center">
              {link.icon}
              {link.text}
            </div>
          </li>
        ))}
      </ul>
      <div className="w-full flex justify-center items-center gap-2 absolute bottom-0 left-0 mb-3">
        <div className="overflow-hidden rounded-full bg-gray-300 w-[30px] h-[30px] flex justify-center items-center">
          <img className="object-cover object-center w-full h-full" src={
                LoggedInUser?.profileImg.includes("https")
                  ? LoggedInUser?.profileImg
                  : baseUrl + "uploads/" + LoggedInUser?.profileImg
              } alt="" />
        </div>
        <Link to={`/profile/${LoggedInUser?._id}`} className="flex flex-col cursor-pointer">
          <p>{LoggedInUser?.name}</p>
          <p>@{LoggedInUser?.userName}</p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
