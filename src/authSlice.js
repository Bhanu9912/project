



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://robo-zv8u.onrender.com";


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


