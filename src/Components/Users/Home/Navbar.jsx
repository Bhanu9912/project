// // src/Components/Users/Home/Navbar.jsx

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FiHome,
//   FiSearch,
//   FiBell,
//   FiEdit3,
//   FiUserPlus,
//   FiSettings,
// } from "react-icons/fi";

// import { useDispatch, useSelector } from "react-redux";
// import { createBlog } from "../../../BlogSlice";
// import CreateBlogModal from "./CreateBlogModal";

// export default function Navbar() {
//   const [active, setActive] = useState("Home");
//   const [showSearch, setShowSearch] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showCreateBlog, setShowCreateBlog] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.auth.user);
//   const notifications = useSelector((state) => state.friends.notifications);
//   const notificationCount = notifications.length;

//   useEffect(() => {
//     const p = location.pathname || "/";
//     if (p.startsWith("/home")) setActive("Home");
//     else if (p.startsWith("/addfriends")) setActive("Add Friends");
//     else if (p.startsWith("/settings")) setActive("Settings");
//     else if (p.startsWith("/profile")) setActive("Profile");
//   }, [location.pathname]);

//   const menuItems = [
//     { label: "Home", icon: <FiHome size={24} />, route: "/home" },
//     { label: "Search", icon: <FiSearch size={24} />, action: () => setShowSearch(true) },
//     {
//       label: "Notifications",
//       icon: <FiBell size={24} />,
//       action: () => setShowNotifications(true),
//     },
//     { label: "Create Blog", icon: <FiEdit3 size={24} />, action: () => setShowCreateBlog(true) },
//     { label: "Add Friends", icon: <FiUserPlus size={24} />, route: "/addfriends" },
//     { label: "Settings", icon: <FiSettings size={24} />, route: "/settings" },
//   ];

//   const handleClick = (item) => {
//     setActive(item.label);
//     if (item.action) item.action();
//     if (item.route) navigate(item.route);
//   };

//   const handlePostBlog = async (title, content) => {
//     await dispatch(createBlog({ title, content }));
//     setShowCreateBlog(false);
//   };

//   return (
//     <>
//       {/* DESKTOP SIDEBAR */}
//       <div className="hidden md:flex w-64 h-screen border-r px-6 py-8 flex-col space-y-8 bg-white">
//         {/* LOGO */}
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
//             B
//           </div>
//           <h1 className="text-2xl font-bold">BlogVerse</h1>
//         </div>

//         {/* PROFILE SECTION */}
//         <div className="text-center">
//           <div className="mx-auto w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center">
//             <img
//               src={
//                 user?.user?.profilePhoto
//                   ? `data:image/jpeg;base64,${user.user.profilePhoto}`
//                   : "/default-profile.png"
//               }
//               alt="profile"
//               className="w-24 h-24 rounded-full object-cover"
//             />
//           </div>

//           <p className="mt-2 font-semibold text-lg">
//             {user?.user?.username || "Loading..."}
//           </p>

//           <button
//             onClick={() => navigate("/profile")}
//             className={`mt-3 px-4 py-2 rounded-lg font-semibold text-sm transition ${
//               active === "Profile"
//                 ? "bg-blue-50 text-blue-600"
//                 : "bg-purple-700 text-white hover:bg-purple-800"
//             }`}
//           >
//             MyProfile
//           </button>
//         </div>

//         {/* NAVIGATION MENU */}
//         <div className="space-y-3 mt-5">
//           {menuItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => handleClick(item)}
//               className={`relative flex items-center gap-3 text-lg font-semibold w-full px-4 py-2 rounded-lg transition ${
//                 active === item.label
//                   ? "bg-purple-100 text-purple-700"
//                   : "text-black hover:bg-gray-100"
//               }`}
//             >
//               {item.label === "Notifications" && notificationCount > 0 && (
//                 <span className="absolute right-4 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                   {notificationCount}
//                 </span>
//               )}
//               {item.icon}
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MOBILE NAVBAR */}
//       <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t py-2 flex justify-around z-50">
//         {menuItems.map((item) => (
//           <button
//             key={item.label}
//             onClick={() => handleClick(item)}
//             className={`relative flex flex-col items-center text-xs ${
//               active === item.label ? "text-purple-600" : "text-gray-600"
//             }`}
//           >
//             {item.icon}
//             {item.label}
//             {item.label === "Notifications" && notificationCount > 0 && (
//               <span className="absolute top-0 right-5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
//                 {notificationCount}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* CREATE BLOG MODAL */}
//       <CreateBlogModal
//         open={showCreateBlog}
//         onClose={() => setShowCreateBlog(false)}
//         onPost={handlePostBlog}
//       />

//       {/* NOTIFICATION PANEL */}
//       {showNotifications && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-start z-50">
//           <div className="w-80 h-full bg-white p-5 overflow-y-auto shadow-xl">
//             <h2 className="text-xl font-semibold mb-4">Notifications</h2>

//             {notifications.length === 0 ? (
//               <p className="text-gray-500">No notifications yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {notifications.map((note, i) => (
//                   <div key={i} className="p-3 bg-gray-100 rounded-lg text-sm">
//                     {note.msg}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <button
//               onClick={() => setShowNotifications(false)}
//               className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


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

  // ============================
  // SOCKET EVENTS (Real-Time)
  // ============================
  useEffect(() => {
    if (!authUser?._id) return;

    // Register this user with socket server
    socket.emit("register", authUser._id);

    // Incoming follow request
    socket.on("followRequestReceived", (data) => {
      console.log("FOLLOW REQUEST RECEIVED:", data);

      dispatch(
        addRequest({
          id: data.fromId,
          name: data.fromName,
          username: "@" + data.fromUsername,
          status: "pending",
        })
      );

      dispatch(
        addNotification(`New follow request from @${data.fromUsername}`)
      );

      toast.success(`New follow request from @${data.fromUsername}`);
    });

    // Request accepted
    socket.on("followRequestAccepted", (data) => {
      console.log("REQUEST ACCEPTED:", data);

      dispatch(
        addNotification(`@${data.byUsername} accepted your follow request`)
      );

      toast.success(`@${data.byUsername} accepted your request`);
    });

    // Request rejected
    socket.on("followRequestRejected", (data) => {
      console.log("REQUEST REJECTED:", data);

      dispatch(
        addNotification(`@${data.byUsername} rejected your follow request`)
      );

      toast.error(`@${data.byUsername} rejected your request`);
    });

    return () => {
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
      socket.off("followRequestRejected");
    };
  }, []); // IMPORTANT: run only ONCE

  // ============================
  // SEND FOLLOW REQUEST
  // ============================
  const handleSend = async () => {
    if (usernameInput.trim() === "") {
      toast.error("Enter a username");
      return;
    }

    try {
      const token = authUser?.token;

      await sendFollowRequest(usernameInput, token);

      toast.success(`Follow request sent to @${usernameInput}`);

      dispatch(
        addNotification(`You sent a follow request to @${usernameInput}`)
      );

      setUsernameInput("");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  // ============================
  // ACCEPT REQUEST
  // ============================
  const handleAccept = (id) => {
    dispatch(acceptFollowRequest(id))
      .unwrap()
      .then(() => toast.success("Request accepted"))
      .catch(() => toast.error("Failed to accept request"));
  };

  // ============================
  // DECLINE REQUEST
  // ============================
  const handleDecline = (id) => {
    dispatch(rejectFollowRequest(id))
      .unwrap()
      .then(() => toast("Request declined"))
      .catch(() => toast.error("Failed to decline request"));
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Add Friends</h1>

        {/* INPUT + SEND BUTTON */}
        <div className="flex gap-3 mb-10">
          <input
            className="border p-2 rounded-full w-64"
            placeholder="Enter username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />

          <button
            onClick={handleSend}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
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

