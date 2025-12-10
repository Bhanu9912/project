



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

  /* 🔥 LOAD EXISTING FRIENDS + REQUESTS WHEN LOGGED IN */
  useEffect(() => {
    if (!authUser) return;

    const user = authUser.user;

    const loadedFriends = (user.followers || []).map((u) => ({
      id: u._id,
      name: u.username,
      username: u.username,
    }));

    const loadedRequests = (user.pendingRequests || []).map((u) => ({
      id: u._id,
      name: u.username,
      username: u.username,
    }));

    dispatch(
      setInitialFriends({
        friends: loadedFriends,
        requests: loadedRequests,
      })
    );
  }, [authUser, dispatch]);

  /* SOCKET EVENTS */
  useEffect(() => {
    if (!authUser) return;

    socket.connect();

    const userId = authUser?.user?._id || authUser?._id;
    if (!userId) return;

    socket.emit("register", userId);

    // Incoming follow request
    socket.on("followRequestReceived", (data) => {
      toast.success(`New follow request from @${data.from}`);

      dispatch(
        addRequest({
          id: data.fromId,
          name: data.from,
          username: data.from,
        })
      );

      dispatch(addNotification(`New follow request from @${data.from}`));
    });

    // Someone ACCEPTED my request
    socket.on("followRequestAccepted", (data) => {
      toast.success(`${data.by} accepted your request`);

      dispatch(addNotification(`${data.by} accepted your request`));

      dispatch(
        addFriend({
          id: data.byId,
          name: data.by,
          username: data.by,
        })
      );
    });

    // Someone REJECTED my request
    socket.on("followRequestRejected", (data) => {
      toast.error(`${data.by} rejected your request`);
      dispatch(addNotification(`${data.by} rejected your request`));
    });

    return () => {
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
      socket.off("followRequestRejected");
    };
  }, [authUser, dispatch]);

  /* SEND FOLLOW REQUEST */
  const handleSend = async () => {
    if (!usernameInput.trim()) {
      toast.error("Enter a username");
      return;
    }

    try {
      const token = authUser?.token || authUser?.user?.token;

      await sendFollowRequest(usernameInput, token);

      toast.success(`Request sent to @${usernameInput}`);
      dispatch(addNotification(`You sent a follow request to @${usernameInput}`));

      setUsernameInput("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  };

  /* ACCEPT REQUEST */
  const handleAccept = (id) => {
    dispatch(acceptFollowRequest(id))
      .unwrap()
      .then(() => {
        toast.success("Request accepted");
        dispatch(addNotification("You accepted a friend request"));
      })
      .catch(() => toast.error("Failed to accept"));
  };

  /* DECLINE */
  const handleDecline = (id) => {
    dispatch(rejectFollowRequest(id))
      .unwrap()
      .then(() => {
        toast("Request declined");
        dispatch(addNotification("You rejected a friend request"));
      })
      .catch(() => toast.error("Failed to decline"));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Add Friends</h1>

        {/* SEND REQUEST INPUT */}
        <div className="flex gap-3 mb-10">
          <input
            className="border p-2 rounded-full w-64"
            placeholder="Enter username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <button
            onClick={handleSend}
            className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Send Request
          </button>
        </div>

        {/* FRIEND REQUESTS */}
        <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">No friend requests yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border shadow p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {req.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="font-semibold">{req.name}</div>
                    <div className="text-xs text-gray-500">@{req.username}</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleDecline(req.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FRIENDS LIST */}
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>

        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {friends.map((fr) => (
              <div
                key={fr.id}
                className="bg-white rounded-xl border shadow p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {fr.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="font-semibold">{fr.name}</div>
                    <div className="text-xs text-gray-500">@{fr.username}</div>
                  </div>
                </div>

                {/* Add buttons like View Profile / Remove later */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

