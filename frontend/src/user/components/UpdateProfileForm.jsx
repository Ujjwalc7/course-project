import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { updateProfileDetailsThunk } from "../../store/slices/user/authSlice";
import { Button, Grid, Link, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "6%",
  left: "50%",
  transform: "translate(-50%)",
  maxWidth: 300,
  width: "100%",
  minHeight: 300,
  bgcolor: "background.paper",
  border: "1px solid#d6d6d6",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const removeKeyFromObject =(obj)=> {
  // new object to store the filtered key-value pairs
  const filteredObj = {};

  // Iterate over the keys of the input object
  for (const key in obj) {
      // Check if the value is not an empty string
      if (obj[key] !== '') {
          // Add the key-value pair to the filtered object
          filteredObj[key] = obj[key];
      }
  }

  return filteredObj;
}


export default function UpdateProfileForm({
  openCloseUpdateForm,
  openUpdateForm,
}) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      name: data.get("name"),
      location: data.get("location"),
      dateOfbirth: data.get("date"),
    };
    const formData = removeKeyFromObject(body); //filtering object key value pairs that has an empty string
    dispatch(updateProfileDetailsThunk({formData: formData, userId: id, jwt: jwt}));
    openCloseUpdateForm();
    // window.location.reload();
  };

  return (
    <div>
      <Modal
        open={openUpdateForm}
        onClose={openCloseUpdateForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="rounded-md w-full px-2 py-1 border-gray-500 outline-none border"
            />
            </div>
            <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              className="rounded-md w-full px-2 py-1 border-gray-500 outline-none border"
            />
            </div>
            <div>
            <label htmlFor="date">Date of Birth</label>
            <input
              type="date"
              name="date"
              id="date"
              className="rounded-md w-full px-2 py-1 border-gray-500 outline-none border"
            />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
