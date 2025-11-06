

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://192.168.0.21:5000";

const initialState = {
  user: [],
  loading: false,
  error: null,
};

// ✅ REGISTER USER
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/users/register`, payload);
      console.log("Register success:", data);
      return data; // return whatever backend sends
    } catch (err) {
      console.error("Register error:", err);
      return rejectWithValue(err.response?.data || "Registration failed");
    }
  }
);

// ✅ LOGIN USER
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://192.168.0.21:5000/api/users/login",
        payload
      );
      console.log("Login success:", data);
      return data;
    } catch (err) {
      console.error("Login error:", err);
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.push(action.payload);
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
    .addCase(loginUser.pending, (state) => {
        state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });

    },

    });




export default userSlice.reducer;
