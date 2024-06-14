import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { baseUrl } from "../../../config/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import postTweet from "../../../store/services/tweets/postTweet";
import replyTweet from "../../../store/services/tweets/replyTweet";
import zIndex from "@mui/material/styles/zIndex";
import { createTweetThunk, setReplyToTweet, setReplyToTweets } from "../../../store/slices/user/tweetSlice";

const style = {
  position: "absolute",
  top: "6%",
  left: "50%",
  transform: "translate(-50%)",
  maxWidth: 480,
  width: "100%",
  minHeight: 280,
  maxHeight: 480,
  bgcolor: "background.paper",
  border: "1px solid#d6d6d6",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  overflowY: "scroll",
};
const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
};

export default function TweetBox({ postId, handleOpenOrClose, open }) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [text, setText] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const LoggedInUser = useSelector((state) => state.auth.LoggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {tweetId} = useParams();


  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const jwt = localStorage.getItem("jwt");
      const formData = new FormData();
      formData.append("content", text);
      if(file){
        formData.append("image", file);
      }
      if (postId) {
        const resp = await replyTweet(postId, formData, jwt);
        if(resp._id){
          if(tweetId){
            dispatch(setReplyToTweet({resp: resp, tweetId: postId}));
          }else{
            dispatch(setReplyToTweets({resp: resp, tweetId: postId}))
          }
          handleOpenOrClose();
        }
      } else {
          dispatch(createTweetThunk({ formData: formData, jwt: jwt }))
          handleOpenOrClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fileInputRef = React.useRef(null);
  const handleSVGClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleOpenOrClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {
            <form onSubmit={handleForm} className="flex flex-col">
              <div className="mb-2 font-robot">New Tweet</div>
              <div className="flex gap-2">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <img
                    style={imgStyle}
                    src={
                      LoggedInUser?.profileImg.includes("https")
                        ? LoggedInUser?.profileImg
                        : baseUrl + "uploads/" + LoggedInUser?.profileImg
                    }
                    alt=""
                  />
                </div>
                <div className="flex-grow h-[120px] overflow-hidden border border-gray-300 ">
                  <textarea
                    className="w-full h-full outline-none p-2"
                    onChange={(e) => setText(e.target.value)}
                    name="textInput"
                    id="textInput"
                  ></textarea>
                </div>
              </div>
              <hr className="w-full h-[2px] mt-4 bg-gray-300 " />
              <div className="flex w-full pt-3 relative justify-between items-center">
                <AddPhotoAlternateIcon
                  className=" cursor-pointer"
                  onClick={handleSVGClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  name="fileInput"
                  id="fileInput"
                />
                {selectedFile && (
                  <span
                    className="cursor-pointer absolute left-8 flex justify-center items-center w-[20px] h-[20px] rounded-full bg-slate-500 text-white"
                    onClick={() => setSelectedFile(null)}
                  >
                    X
                  </span>
                )}
                {selectedFile || text ? (
                  <button
                    type="submit"
                    className="rounded-xl px-3 bg-blue-300 hover:bg-blue-400"
                  >
                    Post
                  </button>
                ) : null}
              </div>
            </form>
          }

          {selectedFile && (
            <div className="mt-2 w-full overflow-hidden">
              <img className="preview_img" src={selectedFile} alt="preview" />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
