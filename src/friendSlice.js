


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  acceptFollowRequest as acceptAPI,
  rejectFollowRequest as rejectAPI,
} from "./followService";

// ACCEPT REQUEST
export const acceptFollowRequest = createAsyncThunk(
  "friends/acceptFollowRequest",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    await acceptAPI(id, token);
    return id;
  }
);

// REJECT REQUEST
export const rejectFollowRequest = createAsyncThunk(
  "friends/rejectFollowRequest",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    await rejectAPI(id, token);
    return id;
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    requests: [],
    notifications: [],
  },
  reducers: {
    addRequest: (state, action) => {
      const exists = state.requests.some((r) => r.id === action.payload.id);
      if (!exists) state.requests.push(action.payload);
    },

    addNotification: (state, action) => {
      state.notifications.push({ msg: action.payload, time: Date.now() });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (req) => req.id !== action.payload
        );
      })
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (req) => req.id !== action.payload
        );
      });
  },
});

export const { addRequest, addNotification } = friendSlice.actions;
export default friendSlice.reducer;
