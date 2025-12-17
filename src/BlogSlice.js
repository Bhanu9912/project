

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { socket } from "./socket";

const BASE_URL = "https://robo-zv8u.onrender.com";

const getAuthToken = (getState) => {
  return getState().auth?.user?.token || null;
};

/* GET ALL BLOGS */
export const getAllBlogs = createAsyncThunk(
  "blogs/getAllBlogs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("No token");

      const { data } = await axios.get(`${BASE_URL}/api/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching blogs");
    }
  }
);

/* CREATE BLOG */
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async ({ title, content }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("No token");

      const { data } = await axios.post(
        `${BASE_URL}/api/articles`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating blog");
    }
  }
);

/* LIKE / UNLIKE BLOG */
export const toggleLike = createAsyncThunk(
  "blogs/toggleLike",
  async (articleId, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      const user = getState().auth?.user;
      const userId = user?._id;
      const username = user?.username || user?.email;

      const { data } = await axios.put(
        `${BASE_URL}/api/articles/${articleId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔔 SOCKET EMIT (ADDED)
      socket.emit("articleLiked", {
        articleId,
        likedBy: username,
        ownerId: data.article?.user,
      });

      return { articleId, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error toggling like");
    }
  }
);

/* ADD COMMENT */
export const addComment = createAsyncThunk(
  "blogs/addComment",
  async ({ articleId, comment }, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);
      const user = getState().auth?.user;
      const username = user?.username || user?.email;

      const { data } = await axios.post(
        `${BASE_URL}/api/articles/${articleId}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔔 SOCKET EMIT (ADDED)
      socket.emit("newComment", {
        articleId,
        comment,
        commentedBy: username,
        ownerId: data.article?.user,
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding comment");
    }
  }
);

/* SLICE */
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = (action.payload || []).map((b) => ({
          ...b,
          likes: Array.isArray(b.likes) ? b.likes : [],
          comments: Array.isArray(b.comments) ? b.comments : [],
        }));
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBlog.fulfilled, (state, action) => {
        const payload = action.payload;

        const newBlog = {
          ...payload,
          user:
            typeof payload.user === "string"
              ? { _id: payload.user }
              : payload.user,
          likes: Array.isArray(payload.likes) ? payload.likes : [],
          comments: Array.isArray(payload.comments)
            ? payload.comments
            : [],
        };

        state.blogs.unshift(newBlog);
      })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const { articleId, userId } = action.payload;
        const blog = state.blogs.find((b) => b._id === articleId);
        if (!blog) return;

        if (!blog.likes.includes(userId)) {
          blog.likes.push(userId);
        } else {
          blog.likes = blog.likes.filter((id) => id !== userId);
        }
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const updated = action.payload.article;
        state.blogs = state.blogs.map((b) =>
          b._id === updated._id
            ? {
                ...updated,
                likes: updated.likes || [],
                comments: updated.comments || [],
              }
            : b
        );
      });
  },
});

export default blogSlice.reducer;
