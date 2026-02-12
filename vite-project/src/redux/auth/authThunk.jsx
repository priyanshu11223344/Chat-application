import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const registerUser=createAsyncThunk(
    "auth/register",
    async(data,thunkAPI)=>{
        try{
            const res=await api.post("/register",data);
            return res.data;
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
export const verifyOTP=createAsyncThunk(
    "auth/verifyOTP",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/verify-otp",data);
            console.log(res)
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);            
        }
    }
);
export const resendOTP=createAsyncThunk(
    "auth/resendOTP",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/resend-otp",data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);
export const loginUser=createAsyncThunk(
    "auth/login",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/login",data);
            console.log(res);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const resendPassOtp=createAsyncThunk(
    "auth/resendPassOtp",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/resend-pass-otp",data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const verifyPassOtp=createAsyncThunk(
    "auth/verifyPassOtp",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/verify-pass-otp",data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const resetPassword=createAsyncThunk(
    "auth/resetPassword",
    async(data,thunkAPI)=>{
        try {
            const res=await api.post("/forget-pass",data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const getAllUsers=createAsyncThunk(
    "auth/getAllUsers",
    async(_,thunkAPI)=>{
        try {
            const res=await api.get("/getAllUsers");//here is the get request so we don't need to send the data
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
     try {
        await api.post("/logout", { withCredentials: true });
        return true;
     } catch (error) {
        return thunkAPI.rejectWithValue("Error logging out")
     }
    }
  );
  export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_,thunkAPI) => {
     try {
        const res = await api.get("/me", { withCredentials: true });
        console.log("user is authenticated",res.data)
        return res.data; // { user }
     } catch (error) {
        return thunkAPI.rejectWithValue("Error in authCheck");
     }
    }
  );
  