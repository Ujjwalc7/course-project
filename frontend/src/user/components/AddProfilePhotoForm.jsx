import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { updateProfileDetailsThunk } from "../../store/slices/user/authSlice";

const style = {
  position: "absolute",
  top: "6%",
  left: "50%",
  transform: "translate(-50%)",
  maxWidth: 480,
  width: "100%",
  minHeight: 150,
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

export default function AddProfilePhotoForm({ handleOpenOrClose, open }) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const LoggedInUser = useSelector((state) => state.auth.LoggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const fileInputRef = React.useRef(null);
  const jwt = localStorage.getItem("jwt");


  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if(file){
        formData.append("profileImg", file);
        dispatch(updateProfileDetailsThunk({formData: formData, userId: id, jwt: jwt}));
        handleOpenOrClose();
        // window.location.reload();
      }else{
        throw new Error('Select an image');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              <div className="mb-2 font-robot">Add Profile Photo</div>
              <div className="flex w-full pt-3 relative gap-2 items-center">
                <AddPhotoAlternateIcon
                  className=" cursor-pointer"
                  onClick={handleSVGClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className=""
                  onChange={handleFileChange}
                  name="fileInput"
                  id="fileInput"
                />
                {selectedFile && (
                  <span
                    className="cursor-pointer flex justify-center items-center w-[20px] h-[20px] rounded-full bg-slate-500 text-white"
                    onClick={() =>{
                      setFile(null)
                      setSelectedFile(null)
                      fileInputRef.current.value = null;
                    }}
                  >
                    X
                  </span>
                )}
                {selectedFile ? (
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
