import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://192.168.0.37:5000";

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
      const { data } = await axios.post(`${BASE_URL}/api/users/register`, payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Register success:", data);
      return data;
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
        `${BASE_URL}/api/users/login`,
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

// -- userSlice --
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
      })
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
  }
});

// -- authSlice --
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, isLoading: false, error: null, isAuthenticated: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => { s.isLoading = true; })
      .addCase(registerUser.fulfilled, (s) => { s.isLoading = false; })
      .addCase(registerUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.message; })

      .addCase(loginUser.pending, (s) => { s.isLoading = true; })
      .addCase(loginUser.fulfilled, (s, a) => { s.isLoading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(loginUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload?.message; });
  }
});

// -- Exports --
export default userSlice.reducer;
export const authReducer = authSlice.reducer; // Export authReducer separately if needed

