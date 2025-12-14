



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://robo-zv8u.onrender.com";

// const initialState = {
//   user: null,
//   loading: false,
//   error: null,
//   isAuthenticated: false,
// };

// // REGISTER
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(
//         `${BASE_URL}/api/users/register`,
//         payload,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { message: "Registration failed" }
//       );
//     }
//   }
// );

// // LOGIN
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(
//         `${BASE_URL}/api/users/login`,
//         payload
//       );
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || { message: "Login failed" }
//       );
//     }
//   }
// );

// // LOGOUT
// export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
//   return null;
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     updateProfile: (state, action) => {
//       state.user = { ...state.user, ...action.payload };
//     },

//     // update followers list (EXISTING)
//     updateFollowers: (state, action) => {
//       if (state.user?.user) {
//         state.user.user.followers = action.payload;
//       }
//     },

//     // update following list (EXISTING)
//     updateFollowing: (state, action) => {
//       if (state.user?.user) {
//         state.user.user.following = action.payload;
//       }
//     },

//     // ⭐ NEW: LIVE FOLLOW / UNFOLLOW SYNC
//     updateFollowersFollowing: (state, action) => {
//       if (!state.user?.user) return;

//       const { type, userId } = action.payload;

//       if (type === "ADD_FOLLOWER") {
//         state.user.user.followers.push({ _id: userId });
//       }

//       if (type === "ADD_FOLLOWING") {
//         state.user.user.following.push({ _id: userId });
//       }

//       if (type === "REMOVE_FOLLOWER") {
//         state.user.user.followers = state.user.user.followers.filter(
//           (u) => u._id !== userId
//         );
//       }

//       if (type === "REMOVE_FOLLOWING") {
//         state.user.user.following = state.user.user.following.filter(
//           (u) => u._id !== userId
//         );
//       }
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // REGISTER
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       // LOGOUT
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const {
//   updateProfile,
//   updateFollowers,
//   updateFollowing,
//   updateFollowersFollowing, // ⭐ NEW EXPORT
// } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://robo-zv8u.onrender.com";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/users/register`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/users/login`,
        payload
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Login failed" }
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    updateFollowers: (state, action) => {
      if (state.user?.user) {
        state.user.user.followers = action.payload;
      }
    },

    updateFollowing: (state, action) => {
      if (state.user?.user) {
        state.user.user.following = action.payload;
      }
    },

    updateFollowersFollowing: (state, action) => {
      if (!state.user?.user) return;

      const { type, userId } = action.payload;

      if (type === "ADD_FOLLOWER") {
        state.user.user.followers.push({ _id: userId });
      }

      if (type === "ADD_FOLLOWING") {
        state.user.user.following.push({ _id: userId });
      }

      if (type === "REMOVE_FOLLOWER") {
        state.user.user.followers = state.user.user.followers.filter(
          (u) => u._id !== userId
        );
      }

      if (type === "REMOVE_FOLLOWING") {
        state.user.user.following = state.user.user.following.filter(
          (u) => u._id !== userId
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // LOGIN (⭐ FIXED HERE ONLY)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          ...action.payload,
          user: {
            ...action.payload.user,
            followers: [...(action.payload.user?.followers || [])],
            following: [...(action.payload.user?.following || [])],
            profilePhoto: action.payload.user?.profilePhoto
              ? `${action.payload.user.profilePhoto}`
              : null,
          },
        };

        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  updateProfile,
  updateFollowers,
  updateFollowing,
  updateFollowersFollowing,
} = authSlice.actions;

export default authSlice.reducer;
