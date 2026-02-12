import { createSlice } from "@reduxjs/toolkit";
import { loadChats,getLastMessage } from "./chatThunk";
import { createGroup,sendGroupMessage,loadGroups,loadGroupMessages } from "./chatThunk";
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    messages: [],
    loading: false,
    error: null,
    lastChats:[],
    selectedGroup:null,
    groupMessages:[],
    groups:[]
  },

  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetChat:(state)=>{
      state.selectedUser=null;
      state.messages=[];
      state.loading=false;
      state.error=null;
    },
    setSelectedGroup:(state,action)=>{
     state.selectedGroup=action.payload;
     state.groupMessages=[];
    },
    addGroupMessage:(state,action)=>{
      state.groupMessages.push(action.payload);
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLastMessage.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(getLastMessage.fulfilled,(state,action)=>{
        state.loading=false;
        state.lastChats=action.payload
      })
      .addCase(getLastMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.unshift(action.payload.group);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SEND GROUP MESSAGE */
      // .addCase(sendGroupMessage.fulfilled, (state, action) => {
      //   state.groupMessages.push(action.payload);
      // })
      .addCase(loadGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(loadGroupMessages.fulfilled, (state, action) => {
        state.groupMessages = action.payload;
      });
      
  }
});

export const {
  setSelectedUser,
  addMessage,
  resetChat,
  setSelectedGroup,      // ✅ ADD
  addGroupMessage        // ✅ ADD
} = chatSlice.actions;

export default chatSlice.reducer;
