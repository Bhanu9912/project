


import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
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
  const [activeTab, setActiveTab] = useState("followers");
  const [isSending, setIsSending] = useState(false);

  /* ================================
     DERIVED DATA
  ================================= */
  const user = authUser?.user;

  const followers =
    (user?.followers || []).map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.username || u.email || "User",
      username: u.username || u.email || "user",
      profilePhoto: u.profilePhoto || null,
    }));

  const following =
    (user?.following || []).map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.username || u.email || "User",
      username: u.username || u.email || "user",
      profilePhoto: u.profilePhoto || null,
    }));

  /* ================================
     INITIAL REQUESTS LOAD
  ================================= */
  useEffect(() => {
    if (!user) return;

    const loadedRequests = (user.pendingRequests || []).map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.username || u.email || "User",
      username: u.username || u.email || "user",
      profilePhoto: u.profilePhoto || null,
    }));

    dispatch(
      setInitialFriends({
        friends,
        requests: loadedRequests,
      })
    );
  }, [user, dispatch]);

  /* ================================
     SEND REQUEST
  ================================= */
  const handleSend = async () => {
    if (!usernameInput.trim()) {
      toast.error("Enter a username");
      return;
    }

    try {
      setIsSending(true);
      const token = authUser?.token || authUser?.user?.token;
      await sendFollowRequest(usernameInput, token);

      toast.success(`Follow request sent to @${usernameInput}`);
      setUsernameInput("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending request");
    } finally {
      setIsSending(false);
    }
  };

  /* ================================
     ACCEPT / DECLINE
  ================================= */
  const handleAccept = (id) => {
    dispatch(acceptFollowRequest(id));
    toast.success("Follow request accepted");
  };

  const handleDecline = (id) => {
    dispatch(rejectFollowRequest(id));
    toast("Follow request rejected", { icon: "❌" });
  };

  /* ================================
     UI
  ================================= */
  return (
    <div className="min-h-screen bg-gray-100  pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          Add Friends
        </h1>

        {/* INPUT */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center sm:items-stretch">
          <input
            className="border px-5 py-3 rounded-full w-full max-w-md focus:outline-none"
            placeholder="Enter username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`px-8 py-3 rounded-full font-medium transition ${
              isSending
                ? "bg-purple-200 text-purple-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Send Request
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {["followers", "following", "requests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FOLLOWERS / FOLLOWING */}
        {(activeTab === "followers" || activeTab === "following") && (
          <>
            {(activeTab === "followers" ? followers : following).length === 0 ? (
              <p className="text-gray-500">No users</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(activeTab === "followers" ? followers : following).map(
                  (fr) => (
                    <div
                      key={fr._id}
                      className="bg-white rounded-xl border p-5 flex flex-col items-center text-center hover:shadow-md transition"
                    >
                      <img
                        src={
                          fr.profilePhoto
                            ? `data:image/jpeg;base64,${fr.profilePhoto}`
                            : "https://via.placeholder.com/64"
                        }
                        alt="profile"
                        className="w-16 h-16 rounded-full mb-3 object-cover"
                      />
                      <div className="font-semibold">{fr.name}</div>
                      <div className="text-xs text-gray-500">
                        @{fr.username}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <>
            {requests.length === 0 ? (
              <p className="text-gray-500">No friend requests</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border p-5 flex flex-col items-center text-center hover:shadow-md transition"
                  >
                    <img
                      src={
                        req.profilePhoto
                          ? `data:image/jpeg;base64,${req.profilePhoto}`
                          : "https://via.placeholder.com/64"
                      }
                      alt="profile"
                      className="w-16 h-16 rounded-full mb-3 object-cover"
                    />
                    <div className="font-semibold">{req.name}</div>
                    <div className="text-xs text-gray-500 mb-4">
                      @{req.username}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
