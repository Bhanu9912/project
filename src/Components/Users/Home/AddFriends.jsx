



import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { socket } from "../../../socket";

import {
  addRequest,
  addNotification,
  addFriend,
  setInitialFriends,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../../../friendSlice";

import { sendFollowRequest } from "../../../followService";

export default function AddFriends() {
  const authUser = useSelector((state) => state.auth.user);
  const requests = useSelector((state) => state.friends.requests);
  const friends = useSelector((state) => state.friends.friends);

  const dispatch = useDispatch();
  const [usernameInput, setUsernameInput] = useState("");

  /* ⭐ LOAD FRIENDS (followers + following from backend user object) */
  useEffect(() => {
    if (!authUser) return;

    const user = authUser.user;

    // Build FRIENDS list
    const loadedFriends = [
      ...(user.followers || []),
      ...(user.following || [])
    ].map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.username || u.email || "User",
      username: u.username || u.email || "user",
    }));

    // Build REQUESTS list
    const loadedRequests = (user.pendingRequests || []).map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.username || u.email || "User",
      username: u.username || u.email || "user",
    }));

    dispatch(
      setInitialFriends({
        friends: loadedFriends,
        requests: loadedRequests,
      })
    );
  }, [authUser, dispatch]);

  /* ⭐ SOCKET.IO EVENTS */
  useEffect(() => {
    if (!authUser) return;

    socket.connect();

    const userId = authUser?.user?._id || authUser?._id;
    if (!userId) return;

    socket.emit("register", userId);

    // 🟣 When someone sends ME a follow request
    socket.on("followRequestReceived", (data) => {
      toast.success(`New follow request from @${data.from}`);

      dispatch(
        addRequest({
          id: data.fromId,
          _id: data.fromId,
          name: data.from,
          username: data.from,
        })
      );

      dispatch(addNotification(`@${data.from} sent you a follow request`));
    });

    // 🟣 When someone ACCEPTS my request
    socket.on("followRequestAccepted", (data) => {
      toast.success(`${data.by} accepted your request`);

      dispatch(
        addFriend({
          id: data.byId,
          _id: data.byId,
          name: data.by,
          username: data.by,
        })
      );

      dispatch(addNotification(`@${data.by} accepted your follow request`));
    });

    return () => {
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
    };
  }, [authUser, dispatch]);

  /* ⭐ SEND REQUEST */
  const handleSend = async () => {
    if (!usernameInput.trim()) {
      toast.error("Enter a username");
      return;
    }

    try {
      const token = authUser?.token || authUser?.user?.token;
      await sendFollowRequest(usernameInput, token);

      toast.success(`Request sent to @${usernameInput}`);
      setUsernameInput("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  };

  /* ⭐ ACCEPT REQUEST */
  const handleAccept = (id) => {
    dispatch(acceptFollowRequest(id));
  };

  /* ⭐ REJECT REQUEST */
  const handleDecline = (id) => {
    dispatch(rejectFollowRequest(id));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Add Friends</h1>

        {/* SEARCH USER */}
        <div className="flex gap-3 mb-10">
          <input
            className="border p-2 rounded-full w-64"
            placeholder="Enter username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <button
            onClick={handleSend}
            className="px-6 py-2 rounded-full bg-purple-600 text-white"
          >
            Send Request
          </button>
        </div>

        {/* FRIEND REQUESTS */}
        <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">No friend requests</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white border rounded p-3 mb-3">
              <div className="font-semibold">{req.name}</div>
              <div className="text-xs">@{req.username}</div>

              <button
                onClick={() => handleAccept(req.id)}
                className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
              >
                Accept
              </button>

              <button
                onClick={() => handleDecline(req.id)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded mt-2 ml-3"
              >
                Decline
              </button>
            </div>
          ))
        )}

        {/* FRIEND LIST */}
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>

        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet</p>
        ) : (
          friends.map((fr) => (
            <div key={fr._id} className="bg-white border rounded p-3 mb-3">
              <div className="font-semibold">{fr.name}</div>
              <div className="text-xs">@{fr.username}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
