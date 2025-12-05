
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://robo-1-qqhu.onrender.com";

// // Load saved user
// const storedUser = JSON.parse(localStorage.getItem("user")) || null;

// const initialState = {
//   user: storedUser,
//   loading: false,
//   error: null,
//   isAuthenticated: !!storedUser,
// };

// // ======================== REGISTER ========================

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

// //
// // ========================== LOGIN =========================
// //
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post(
//         `${BASE_URL}/api/users/login`,
//         payload
//       );

//       // Remove profilePhoto if backend returns base64 image
//       const safeUser = { ...data };
//       delete safeUser.profilePhoto;

//       localStorage.setItem("user", JSON.stringify(safeUser));

//       return safeUser;
//     } catch (err) {
//       console.log(err)
//       return rejectWithValue(
//         err.response?.data || { message: "Login failed" }
//       );
//     }
//   }
// );

// //
// // ========================== LOGOUT ========================
// //
// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async () => {
//     localStorage.removeItem("user");
//     return null;
//   }
// );


// //
// // ========================== SLICE =========================
// //
// const authSlice = createSlice({
//   name: "auth",
//   initialState,

//   reducers: {
//     //
//     // SAFE PROFILE UPDATE (no base64 in localStorage)
//     //
//     updateProfile: (state, action) => {
//       state.user = { ...state.user, ...action.payload };

//       const safeUser = { ...state.user };
//       delete safeUser.profilePhoto;

//       localStorage.setItem("user", JSON.stringify(safeUser));
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
//         state.user = action.payload;   // already safe
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message;
//       })

//       // LOGOUT
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       });
//   },
// });

// export const { updateProfile } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://robo-1-qqhu.onrender.com";

// No more localStorage load
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// ======================== REGISTER ========================

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

// ========================== LOGIN =========================

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/users/login`,
        payload
      );

      // REMOVE BASE64 if backend sends it
      const cleaned = { ...data };

      delete cleaned.profilePhoto;
      if (cleaned.user?.profilePhoto) {
        cleaned.user = { ...cleaned.user };
        delete cleaned.user.profilePhoto;
      }

      return cleaned; // NO LOCALSTORAGE
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Login failed" }
      );
    }
  }
);

// ========================== LOGOUT ========================

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  return null; // NO LOCALSTORAGE REMOVE
});

// ========================== SLICE =========================

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // NO saving to localStorage anymore
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

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { updateProfile } = authSlice.actions;
export default authSlice.reducer;

