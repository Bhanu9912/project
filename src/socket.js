


// import { io } from "socket.io-client";

// // Use env for dev if you want, otherwise your Render backend
// const BASE_URL =
//   import.meta.env.VITE_BACKEND_URL || "https://robo-zv8u.onrender.com";

// export const socket = io(BASE_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
// });


import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://robo-zv8u.onrender.com";

export const socket = io(BASE_URL, {
  // autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
