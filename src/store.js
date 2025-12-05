import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import blogReducer from "./BlogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
