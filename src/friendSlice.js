

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
    requests: [],       // pending requests
    friends: [],        // accepted friends
    notifications: [],  // notification messages
  },

  reducers: {
    addRequest: (state, action) => {
      const exists = state.requests.some((r) => r.id === action.payload.id);
      if (!exists) state.requests.push(action.payload);
    },

    addNotification: (state, action) => {
      state.notifications.push({
        msg: action.payload,
        time: Date.now(),
      });
    },

    addFriend: (state, action) => {
      const exists = state.friends.some((f) => f.id === action.payload.id);
      if (!exists) state.friends.push(action.payload);
    },

    // 🔥 Load existing friends + requests from backend on login
    setInitialFriends: (state, action) => {
      state.friends = action.payload.friends;
      state.requests = action.payload.requests;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        const id = action.payload;

        // move from requests → friends
        const req = state.requests.find((r) => r.id === id);
        if (req) {
          state.friends.push(req);
        }

        // remove from requests list
        state.requests = state.requests.filter((r) => r.id !== id);
      })

      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.requests = state.requests.filter((r) => r.id !== id);
      });
  },
});

export const {
  addRequest,
  addNotification,
  addFriend,
  setInitialFriends,
} = friendSlice.actions;

export default friendSlice.reducer;
