import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import signUp from "../../services/user/signUp";
import login from "../../services/user/login";
import getUserById from "../../services/user/getUserById";
import updateUserProfile from "../../services/user/updateUserProfile";


export const signUpThunk = createAsyncThunk(
    'auth/signUpThunk',async(body)=>{
        const resp = await signUp(body);
        return resp;
    }
)

export const loginThunk = createAsyncThunk(
    'auth/loginThunk',async(body)=>{
        const resp = await login(body);
        return resp;
    }
)

export const getUserByIdThunk = createAsyncThunk(
    'auth/getUserByIdThunk',async({userId, jwt})=>{
        const resp = await getUserById(userId, jwt);
        return resp;
    }
)


export const updateProfileDetailsThunk = createAsyncThunk(
    'auth/updateProfileDetailsThunk', async({formData, userId, jwt})=>{
        const resp = await updateUserProfile(formData, userId, jwt);
        return resp;
    }
)

const initialState = {
    status : false,
    LoggedInUser: null,
    userDetails: null,
    error: null,
    loading: false,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUser: (state, action)=>{
            state.loading = false;
            state.LoggedInUser = action.payload;
            state.error = null;
            state.status = true;
        },
        logout: (state)=>{
            state.loading = false;
            state.LoggedInUser = null;
            state.userDetails = null;
            state.error = null;
            state.status = false;
            console.log('logout');
        },
        setFollowing:(state, action)=>{
            state.LoggedInUser.following.push(action.payload);
            state.userDetails.followers.push(state.LoggedInUser._id);
        },
        setUnfollowing:(state, action)=>{
            state.LoggedInUser.following = state.LoggedInUser.following.filter(userId=>userId !== action.payload);
            state.userDetails.followers = state.userDetails.followers.filter(userId=>userId !== state.LoggedInUser._id);

        },
    },
    extraReducers: (builder)=>{
        builder
        .addCase(signUpThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.status = false;
        })
        .addCase(signUpThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.LoggedInUser = action.payload;
            state.error = null;
            state.status = true;
        })
        .addCase(signUpThunk.rejected,(state, action)=>{
            state.loading = false;
            state.status = false;
            state.error = action.error.message;
        })
        .addCase(loginThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
            state.status = false;
        })
        .addCase(loginThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.error = null;
            state.LoggedInUser = action.payload;
            state.status = true;
        })
        .addCase(loginThunk.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.error.message;
            state.status = false;
        })
        .addCase(getUserByIdThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserByIdThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.error = null;
            state.userDetails = action.payload;
        })
        .addCase(getUserByIdThunk.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateProfileDetailsThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProfileDetailsThunk.fulfilled,(state, action)=>{
            state.loading = false;
            state.error = null;
            state.LoggedInUser = action.payload;
            state.userDetails = action.payload;
        })
        .addCase(updateProfileDetailsThunk.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
    }

});

export const { setUser, logout, setFollowing, setUnfollowing } = authSlice.actions;

export default  authSlice.reducer