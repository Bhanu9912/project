

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://robo-1-qqhu.onrender.com";

const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  user: storedUser,
  loading: false,
  error: null,
  isAuthenticated: !!storedUser
};

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/users/register`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Register failed" });
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

      const userToStore = { ...data };
      delete userToStore.profilePhoto; // ❗ DO NOT store large image

      localStorage.setItem("user", JSON.stringify(userToStore));

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // ⭐ UPDATE PROFILE (SAFE VERSION)
    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };

      // Save only text data — NOT base64 photo
      const safeUser = { ...state.user };
      delete safeUser.profilePhoto;

      localStorage.setItem("user", JSON.stringify(safeUser));
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  }
});

export const { updateProfile } = authSlice.actions;
export default authSlice.reducer;



