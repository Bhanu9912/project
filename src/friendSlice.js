



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   acceptFollowRequest as acceptAPI,
//   rejectFollowRequest as rejectAPI,
// } from "./followService";

// export const acceptFollowRequest = createAsyncThunk(
//   "friends/acceptFollowRequest",
//   async (id, thunkAPI) => {
//     const token = thunkAPI.getState().auth.user?.token;
//     await acceptAPI(id, token);
//     return id;
//   }
// );

// export const rejectFollowRequest = createAsyncThunk(
//   "friends/rejectFollowRequest",
//   async (id, thunkAPI) => {
//     const token = thunkAPI.getState().auth.user?.token;
//     await rejectAPI(id, token);
//     return id;
//   }
// );

// const friendSlice = createSlice({
//   name: "friends",
//   initialState: {
//     requests: [],
//     friends: [],
//     notifications: [],
//     initialized: false,
//   },

//   reducers: {
//     addRequest: (state, action) => {
//       const exists = state.requests.some((r) => r.id === action.payload.id);
//       if (!exists) state.requests.push(action.payload);
//     },

//     // addNotification: (state, action) => {
//     //   state.notifications.push({
//     //     msg: action.payload,
//     //     time: Date.now(),
//     //   });
//     // },

    

//     addFriend: (state, action) => {
//       const exists = state.friends.some((f) => f.id === action.payload.id);
//       if (!exists) state.friends.push(action.payload);
//     },

//     setInitialFriends: (state, action) => {
//       if (state.initialized) return;
//       state.friends = action.payload.friends;
//       state.requests = action.payload.requests;
//       state.initialized = true;
//     },

//     resetFriends: () => ({
//       requests: [],
//       friends: [],
//       notifications: [],
//       initialized: false,
//     }),
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(acceptFollowRequest.fulfilled, (state, action) => {
//         const id = action.payload;
//         const req = state.requests.find((r) => r.id === id);
//         if (req) state.friends.push(req);
//         state.requests = state.requests.filter((r) => r.id !== id);
//       })
//       .addCase(rejectFollowRequest.fulfilled, (state, action) => {
//         const id = action.payload;
//         state.requests = state.requests.filter((r) => r.id !== id);
//       });
//   },
// });

// export const {
//   addRequest,
//   addNotification,
//   addFriend,
//   setInitialFriends,
//   resetFriends,
// } = friendSlice.actions;

// export default friendSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  acceptFollowRequest as acceptAPI,
  rejectFollowRequest as rejectAPI,
} from "./followService";

/* ================= ASYNC ACTIONS ================= */

export const acceptFollowRequest = createAsyncThunk(
  "friends/acceptFollowRequest",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    await acceptAPI(id, token);
    return id;
  }
);

export const rejectFollowRequest = createAsyncThunk(
  "friends/rejectFollowRequest",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    await rejectAPI(id, token);
    return id;
  }
);

/* ================= SLICE ================= */

const friendSlice = createSlice({
  name: "friends",

  initialState: {
    requests: [],
    friends: [],
    notifications: [],
    initialized: false,
  },

  reducers: {
    /* ===== FOLLOW REQUEST ===== */
    addRequest: (state, action) => {
      const exists = state.requests.some(
        (r) => r.id === action.payload.id
      );
      if (!exists) {
        state.requests.push(action.payload);
      }
    },

    /* ===== 🔔 NOTIFICATION (FIXED) ===== */
    addNotification: (state, action) => {
      // EXPECTS: { msg: string, time: number }
      if (
        action.payload &&
        typeof action.payload.msg === "string"
      ) {
        state.notifications.unshift(action.payload); // newest on top
      }
    },

    /* ===== FRIEND ===== */
    addFriend: (state, action) => {
      const exists = state.friends.some(
        (f) => f.id === action.payload.id
      );
      if (!exists) {
        state.friends.push(action.payload);
      }
    },

    /* ===== INIT ===== */
    setInitialFriends: (state, action) => {
      if (state.initialized) return;

      state.friends = action.payload.friends || [];
      state.requests = action.payload.requests || [];
      state.initialized = true;
    },

    /* ===== RESET ===== */
    resetFriends: () => ({
      requests: [],
      friends: [],
      notifications: [],
      initialized: false,
    }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        const id = action.payload;
        const req = state.requests.find((r) => r.id === id);
        if (req) {
          state.friends.push(req);
        }
        state.requests = state.requests.filter((r) => r.id !== id);
      })
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.requests = state.requests.filter((r) => r.id !== id);
      });
  },
});

/* ================= EXPORTS ================= */

export const {
  addRequest,
  addNotification,
  addFriend,
  setInitialFriends,
  resetFriends,
} = friendSlice.actions;

export default friendSlice.reducer;
