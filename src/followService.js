



import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://robo-zv8u.onrender.com";

// SEND FOLLOW REQUEST
export const sendFollowRequest = async (targetUsername, token) => {
  return await axios.post(
    `${BASE_URL}/api/follow/send-request`,
    { targetUsername },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ACCEPT FOLLOW REQUEST
export const acceptFollowRequest = async (followerId, token) => {
  return await axios.post(
    `${BASE_URL}/api/follow/accept-request`,
    { followerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// REJECT FOLLOW REQUEST
export const rejectFollowRequest = async (followerId, token) => {
  return await axios.post(
    `${BASE_URL}/api/follow/reject-request`,
    { followerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

