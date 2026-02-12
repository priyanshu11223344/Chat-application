import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const loadChats=createAsyncThunk(
    "/chat/loadChat",
    async({senderId,receiverId},thunkAPI)=>{
        try {
            const res = await fetch(
                `http://localhost:5000/api/chat/${senderId}/${receiverId}`,
                { credentials: "include" }
              );
              return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const getLastMessage=createAsyncThunk(
    "/chat/getLastMessage",
    async({userId},thunkAPI)=>{
        try {
            const res=await fetch( `http://localhost:5000/api/chat/last-messages/${userId}`,
            {credentials:"include"});
            return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
export const loadGroups=createAsyncThunk(
    "/chat/loadGroups",async(_,thunkAPI)=>{
        try {
            const res=await fetch("http://localhost:5000/api/group/my-groups",
            {
                credentials:"include"
            })
            return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to load groups");
        }
    }
)
export const loadGroupMessages=createAsyncThunk(
    "/chat/loadGroupMessages",async(groupId,thunkAPI)=>{
        try {
            const res=await fetch(`http://localhost:5000/api/group/messages/${groupId}`,
            {
                credentials:"include"
            })
            return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to load Group Messages")
        }
    }
)
export const createGroup=createAsyncThunk(
    "/chat/createGroup",async({name,members},thunkAPI)=>{
        try {
            const res=await fetch("http://localhost:5000/api/group/create",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({name,members})
            });
            if(!res.ok)throw new Error("Failed to create Group");
            return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
export const sendGroupMessage=createAsyncThunk(
    "/chat/sendGroupMessage",async({groupId,message},thunkAPI)=>{
        try {
            const res=await fetch("http://localhost:5000/api/group/message",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({groupId,message})
                
            });
            if(!res.ok)throw new Error("Failed to send Message");
            return await res.json();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)