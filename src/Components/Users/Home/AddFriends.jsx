import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { socket } from "../../../socket";

import {
  addRequest,
  addNotification,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../../../friendSlice";

import { sendFollowRequest } from "../../../followService";

export default function AddFriends() {
  const authUser = useSelector((state) => state.auth.user);
  const requests = useSelector((state) => state.friends.requests);

  const dispatch = useDispatch();

  const [usernameInput, setUsernameInput] = useState("");

  /* SOCKET EVENTS */
  useEffect(() => {
    if (!authUser?._id) return;

    socket.emit("register", authUser._id);

    socket.on("followRequestReceived", (data) => {
      toast.success(`New follow request from ${data.from}`);

      dispatch(
        addRequest({
          id: data.fromId,
          name: data.from,
          username: "@" + data.from,
          status: "pending",
        })
      );

      dispatch(addNotification(`New follow request from ${data.from}`));
    });

    socket.on("followRequestAccepted", (data) => {
      toast.success(`${data.by} accepted your request`);
      dispatch(addNotification(`${data.by} accepted your request`));
    });

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

  /* SEND REQUEST FROM INPUT */
  const handleSend = async () => {
    if (usernameInput.trim() === "") {
      toast.error("Enter a username");
      return;
    }

    try {
      await sendFollowRequest(usernameInput);
      toast.success(`Request sent to @${usernameInput}`);
      dispatch(addNotification(`You sent a follow request to @${usernameInput}`));
      setUsernameInput("");
    } catch (error) {
      toast.error("Failed to send request");
    }
  };

  /* ACCEPT REQUEST */
  const handleAccept = (id) => {
    dispatch(acceptFollowRequest(id))
      .unwrap()
      .then(() => toast.success("Request accepted"))
      .catch(() => toast.error("Failed to accept"));
  };

  /* DECLINE REQUEST */
  const handleDecline = (id) => {
    dispatch(rejectFollowRequest(id))
      .unwrap()
      .then(() => toast("Request declined"))
      .catch(() => toast.error("Failed to decline"));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Add Friends</h1>

        {/* USERNAME INPUT + BUTTON */}
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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border shadow p-5 flex flex-col gap-3"
              >
                <div className="font-semibold">{req.name}</div>
                <div className="text-xs text-gray-500">{req.username}</div>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-full"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleDecline(req.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
