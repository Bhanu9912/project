



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
import CreateBlogModal from "./CreateBlogModal";

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Correct user access
  const user = useSelector((state) => state.auth.user);
  console.log(user)

  useEffect(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/home")) setActive("Home");
    else if (p.startsWith("/addfriends")) setActive("Add Friends");
    else if (p.startsWith("/settings")) setActive("Settings");
    else if (p.startsWith("/profile")) setActive("Profile");
  }, [location.pathname]);

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

        {/* PROFILE SECTION */}
        <div className="text-center">

          {/* PROFILE PHOTO */}
          <div className="mx-auto w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center">
            <img
              src={
                user?.user?.profilePhoto
                  ? `data:image/jpeg;base64,${user.user.profilePhoto}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* USERNAME */}
          <p className="mt-2 font-semibold text-lg">
            {user?.user?.username || "Loading..."}
          </p>

          {/* PROFILE BUTTON */}
          <button
            onClick={() => navigate("/profile")}
            className={`mt-3 px-4 py-2 rounded-lg font-semibold text-sm transition
              ${
                active === "Profile"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-700 text-white hover:bg-purple-800"
              }`}
          >
            MyProfile
          </button>
        </div>

        {/* NAVIGATION MENU */}
        <div className="space-y-3 mt-5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className={`flex items-center gap-3 text-lg font-semibold w-full px-4 py-2 rounded-lg transition 
                ${
                  active === item.label
                    ? "bg-purple-100 text-purple-700"
                    : "text-black hover:bg-gray-100"
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t py-2 flex justify-around z-50">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className={`flex flex-col items-center text-xs ${
              active === item.label ? "text-purple-600" : "text-gray-600"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* CREATE BLOG MODAL */}
      <CreateBlogModal
        open={showCreateBlog}
        onClose={() => setShowCreateBlog(false)}
        onPost={handlePostBlog}
      />
    </>
  );
}

