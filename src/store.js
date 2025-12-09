// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import blogReducer from "./BlogSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     blogs: blogReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import blogReducer from "./BlogSlice";
import friendReducer from "./friendSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    friends: friendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


