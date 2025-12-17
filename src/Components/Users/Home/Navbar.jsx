


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBell,
  FiEdit3,
  FiUserPlus,
  FiSettings,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { createBlog } from "../../../BlogSlice";
import { socket } from "../../../socket";
import { addNotification } from "../../../friendSlice";
import CreateBlogModal from "./CreateBlogModal";

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.auth.user);
  const user = userState?.user;

  const notifications = useSelector((state) => state.friends.notifications);
  const notificationCount = notifications.length;

  // ⭐ ACTIVE ROUTE
  useEffect(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/home")) setActive("Home");
    else if (p.startsWith("/addfriends")) setActive("Add Friends");
    else if (p.startsWith("/settings")) setActive("Settings");
    else if (p.startsWith("/profile")) setActive("Profile");
  }, [location.pathname]);

  // 🔔 SOCKET LISTENERS (ONLY ADDITION)
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", user._id);

    socket.on("articleLiked", (data) => {
      if (data.ownerId === user._id) {
        dispatch(
          addNotification(`❤️ Your post was liked by ${data.likedBy}`)
        );
      }
    });

    socket.on("newComment", (data) => {
      if (data.ownerId === user._id) {
        dispatch(addNotification("💬 New comment on your post"));
      }
    });

    return () => {
      socket.off("articleLiked");
      socket.off("newComment");
    };
  }, [user?._id, dispatch]);

  const menuItems = [
    { label: "Home", icon: <FiHome size={24} />, route: "/home" },
    { label: "Search", icon: <FiSearch size={24} />, action: () => setShowSearch(true) },
    { label: "Notifications", icon: <FiBell size={24} />, action: () => setShowNotifications(true) },
    { label: "Create Blog", icon: <FiEdit3 size={24} />, action: () => setShowCreateBlog(true) },
    { label: "Add Friends", icon: <FiUserPlus size={24} />, route: "/addfriends" },
    { label: "Settings", icon: <FiSettings size={24} />, route: "/settings" },
  ];

  const handleClick = (item) => {
    setActive(item.label);
    if (item.action) item.action();
    if (item.route) navigate(item.route);
  };

  const handlePostBlog = async (title, content) => {
    await dispatch(createBlog({ title, content }));
    setShowCreateBlog(false);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-64 h-screen border-r px-6 py-8 flex-col space-y-8 bg-white">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
            B
          </div>
          <h1 className="text-2xl font-bold">BlogVerse</h1>
        </div>

        {/* USER PROFILE */}
        <div className="text-center">
          <div className="mx-auto w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
            <img
              src={
                user?.profilePhoto
                  ? `data:image/jpeg;base64,${user.profilePhoto}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          <p className="mt-2 font-semibold text-lg">
            {user?.username || user?.email || "User"}
          </p>

          <button
            onClick={() => navigate("/profile")}
            className={`mt-3 px-4 py-2 rounded-lg font-semibold text-sm ${
              active === "Profile"
                ? "bg-purple-200 text-purple-700"
                : "bg-purple-700 text-white"
            }`}
          >
            My Profile
          </button>
        </div>

        {/* MENU */}
        <div className="space-y-3 mt-5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`relative flex items-center gap-3 text-lg font-semibold w-full px-4 py-2 rounded-lg ${
                active === item.label
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {item.label === "Notifications" && notificationCount > 0 && (
                <span className="absolute right-4 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* CREATE BLOG MODAL */}
      <CreateBlogModal
        open={showCreateBlog}
        onClose={() => setShowCreateBlog(false)}
        onPost={handlePostBlog}
      />

      {/* NOTIFICATION PANEL */}
      {showNotifications && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-50">
          <div className="w-80 h-full bg-white p-5 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {notifications.length === 0 ? (
              <p>No notifications yet</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 bg-gray-100 rounded mb-2">
                  <div>{n.msg}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(n.time).toLocaleString()}
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => setShowNotifications(false)}
              className="mt-4 w-full py-2 bg-purple-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

