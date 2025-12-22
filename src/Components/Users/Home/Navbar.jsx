


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

  /* =====================================================
     🔁 RESOLVE USERNAME FROM FOLLOWERS / FOLLOWING
  ===================================================== */
  const resolveUsername = (msg) => {
    if (!msg || typeof msg !== "string") return msg;

    const match = msg.match(/@([a-f0-9]{24})/);
    if (!match) return msg;

    const userId = match[1];

    const allUsers = [
      ...(user?.followers || []),
      ...(user?.following || []),
    ];

    const found = allUsers.find(
      (u) => u?._id === userId || u?.id === userId
    );

    if (!found?.username) {
      return msg.replace(`@${userId}`, "@Someone");
    }

    return msg.replace(`@${userId}`, `@${found.username}`);
  };

  /* =====================================================
     🧠 SAFELY GET COMMENTER ID (FIXES @undefined)
  ===================================================== */
  const getCommenterId = (data) => {
    return (
      data?.comment?.by ||
      data?.comment?.userId ||
      data?.comment?.fromId ||
      data?.fromId ||
      data?.userId ||
      "unknown"
    );
  };

  /* ================= ACTIVE ROUTE ================= */
  useEffect(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/home")) setActive("Home");
    else if (p.startsWith("/addfriends")) setActive("Add Friends");
    else if (p.startsWith("/settings")) setActive("Settings");
    else if (p.startsWith("/profile")) setActive("Profile");
  }, [location.pathname]);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", user._id);

    /* ❤️ LIKE */
    socket.on("articleLiked", (data) => {
      if (data.ownerId === user._id) {
        dispatch(
          addNotification({
            msg: `❤️ @${data.likedBy} liked your post`,
            time: Date.now(),
          })
        );
      }
    });

    /* 💬 COMMENT (FIXED) */
    socket.on("newComment", (data) => {
      if (data.ownerId === user._id) {
        const commenterId = getCommenterId(data);

        dispatch(
          addNotification({
            msg: `💬 @${commenterId} commented: "${data.comment?.text || ""}"`,
            time: Date.now(),
          })
        );
      }
    });

    return () => {
      socket.off("articleLiked");
      socket.off("newComment");
    };
  }, [user?._id, dispatch]);

  /* ================= MENU ITEMS ================= */
  const menuItems = [
    { label: "Home", icon: <FiHome size={24} />, route: "/home" },
    {
      label: "Search",
      icon: <FiSearch size={24} />,
      action: () => setShowSearch(true),
    },
    {
      label: "Notifications",
      icon: <FiBell size={24} />,
      action: () => setShowNotifications(true),
    },
    {
      label: "Create Blog",
      icon: <FiEdit3 size={24} />,
      action: () => setShowCreateBlog(true),
    },
    {
      label: "Add Friends",
      icon: <FiUserPlus size={24} />,
      route: "/addfriends",
    },
    {
      label: "Settings",
      icon: <FiSettings size={24} />,
      route: "/settings",
    },
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
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex w-64 h-screen border-r px-6 py-8 flex-col space-y-8 bg-white fixed">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
            B
          </div>
          <h1 className="text-2xl font-bold">BlogVerse</h1>
        </div>

        <div className="text-center">
          <div className="mx-auto w-28 h-28 rounded-full bg-purple-100 overflow-hidden">
            <img
              src={
                user?.profilePhoto
                  ? `data:image/jpeg;base64,${user.profilePhoto}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-2 font-semibold text-lg">
            {user?.username || user?.email || "User"}
          </p>

          <button
            onClick={() => navigate("/profile")}
            className="mt-3 px-4 py-2 rounded-lg bg-purple-700 text-white text-sm font-semibold"
          >
            My Profile
          </button>
        </div>

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

      {/* ================= CREATE BLOG MODAL ================= */}
      <CreateBlogModal
        open={showCreateBlog}
        onClose={() => setShowCreateBlog(false)}
        onPost={handlePostBlog}
      />

      {/* ================= NOTIFICATION PANEL ================= */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="w-80 h-full bg-white p-5 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {notifications.length === 0 ? (
              <p>No notifications yet</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 bg-gray-100 rounded mb-2">
                  <div className="font-medium">
                    {resolveUsername(
                      typeof n.msg === "string" ? n.msg : n.msg?.msg
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(n.time || n.msg?.time).toLocaleString()}
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

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => navigate("/home")}>
            <FiHome size={22} />
          </button>

          <button onClick={() => setShowSearch(true)}>
            <FiSearch size={22} />
          </button>

          <button onClick={() => setShowCreateBlog(true)}>
            <FiEdit3 size={26} className="text-purple-600" />
          </button>

          <button onClick={() => navigate("/addfriends")}>
            <FiUserPlus size={22} />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
            <FiBell size={22} />
          </button>

          <button onClick={() => navigate("/profile")}>
            <img
              src={
                user?.profilePhoto
                  ? `data:image/jpeg;base64,${user.profilePhoto}`
                  : "/default-profile.png"
              }
              className="w-8 h-8 rounded-full object-cover"
              alt="me"
            />
          </button>
        </div>
      </div>
    </>
  );
}
