
// import React, { useState } from "react";
// import Navbar from "./Navbar";
// // import { CreateBlogModal } from "./AddFriends";
// import CreateBlogModal from "./CreateBlogModal";

// import { useNavigate } from "react-router-dom";
// import {
//   FiHome,
//   FiSearch,
//   FiBell,
//   FiEdit3,
//   FiUserPlus,
//   FiSettings,
//   FiHeart,
//   FiMessageCircle,
//   FiBookmark,
//   FiUser,
//   FiX,
// } from "react-icons/fi";
// import { useSelector } from "react-redux";

// const initialPosts = [
//   {
//     id: 1,
//     author: "Alex Johnson",
//     content:
//       "Exploring how small daily writing habits can transform your creativity over time.",
//     likes: 12,
//     comments: 4,
//     saves: 3,
//   },
//   {
//     id: 2,
//     author: "Priya Sharma",
//     content: "5 ways to make your blog more engaging for first-time visitors.",
//     likes: 18,
//     comments: 6,
//     saves: 5,
//   },
//   {
//     id: 3,
//     author: "Michael Lee",
//     content:
//       "How I turned weekend journaling into a full-time blog in just one year.",
//     likes: 25,
//     comments: 10,
//     saves: 9,
//   },
//   {
//     id: 4,
//     author: "Sara Wilson",
//     content:
//       "Design tips to make your blog posts more readable and visually pleasing.",
//     likes: 9,
//     comments: 2,
//     saves: 4,
//   },
//   {
//     id: 5,
//     author: "David Kim",
//     content:
//       "Why storytelling is the most powerful tool for building a loyal audience.",
//     likes: 31,
//     comments: 12,
//     saves: 15,
//   },
//   {
//     id: 6,
//     author: "Emily Brown",
//     content:
//       "Balancing authenticity and privacy while sharing your life online.",
//     likes: 7,
//     comments: 3,
//     saves: 2,
//   },
// ];

// const initialNotifications = [
//   "Priya commented on your post.",
//   "You have 3 new followers.",
//   "Your blog 'Daily Writing Habits' reached 1k views!",
//   "Alex liked your recent blog.",
//   "New recommendation: 'Top 10 productivity hacks'.",
//   "Your profile was viewed 12 times today.",
//   "Reminder: Finish your draft 'Travel Diaries'.",
//   "Weekly digest is ready.",
//   "New message from Sara.",
//   "System: maintenance tonight.",
//   "Tip: Add tags to increase discoverability.",
// ];

// const initialRecentSearches = [
//   "Productivity blogs",
//   "Travel stories",
//   "Tech trends 2025",
//   "Minimalist lifestyle",
//   "Personal finance tips",
//   "Photography blogs",
//   "Health & wellness",
// ];


// function NavButton({ icon: Icon, label, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center md:gap-3 px-0 md:px-3 py-2 rounded-lg 
//         w-14 md:w-full justify-center md:justify-start 
//         text-sm font-medium transition
//         ${
//           active
//             ? "bg-blue-50 text-blue-600"
//             : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
//         }`}
//     >
//       <Icon className="text-lg" />
//       <span className="hidden md:inline">{label}</span>
//     </button>
//   );
// }

// function PostCard({ post }) {
//   const [liked, setLiked] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes);
//   const [commentCount, setCommentCount] = useState(post.comments);
//   const [saveCount, setSaveCount] = useState(post.saves);

//   const handleLike = () => {
//     const newLiked = !liked;
//     setLiked(newLiked);
//     setLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
//   };

//   const handleSave = () => {
//     const newSaved = !saved;
//     setSaved(newSaved);
//     setSaveCount((c) => (newSaved ? c + 1 : Math.max(0, c - 1)));
//   };

//   const handleComment = () => {
//     setCommentCount((c) => c + 1);
//   };

//   return (
//     <div className="bg-gray-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
//           <FiUser className="text-2xl text-purple-600" />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">{post.author}</span>
//           <span className="text-xs text-gray-500">From your network</span>
//         </div>
//       </div>

//       <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>

//       {/* ACTIONS */}
//       <div className="flex items-center justify-end gap-6 pt-2 border-t border-gray-200">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
//         >
//           <FiHeart
//             className={`text-lg ${
//               liked ? "text-red-500 fill-red-500" : "text-gray-500"
//             }`}
//           />
//           <span className={liked ? "text-red-500" : "text-gray-600"}>
//             Like
//           </span>
//           <span className="text-[11px] text-gray-500">• {likeCount}</span>
//         </button>

//         <button
//           onClick={handleComment}
//           className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-purple-600 hover:opacity-80 transition"
//         >
//           <FiMessageCircle className="text-lg" />
//           <span>Comment</span>
//           <span className="text-[11px] text-gray-500">• {commentCount}</span>
//         </button>

//         <button
//           onClick={handleSave}
//           className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
//         >
//           <FiBookmark
//             className={`text-lg ${
//               saved ? "text-purple-600 fill-purple-600" : "text-gray-500"
//             }`}
//           />
//           <span className={saved ? "text-purple-600" : "text-gray-600"}>
//             Save
//           </span>
//           <span className="text-[11px] text-gray-500">• {saveCount}</span>
//         </button>
//       </div>
//     </div>
//   );
// }


// function SlidePanel({
//   type,
//   onClose,
//   notificationsState,
//   setNotificationsState,
//   recentSearchesState,
//   setRecentSearchesState,
// }) {
//   const isOpen = type !== null;
//   const [searchInput, setSearchInput] = useState("");

//   const clearRecentSearches = () => {
//     setRecentSearchesState([]);
//     setSearchInput("");
//   };

//   const clearNotifications = () => {
//     setNotificationsState([]);
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       {/* Panel container */}
//       <div
//         className={`fixed left-0 top-4 bottom-4 md:top-16 md:bottom-16 z-50 w-72 sm:w-80 bg-white shadow-lg transform transition-transform duration-300 overflow-hidden
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           borderTopRightRadius: "0.75rem",
//           borderBottomRightRadius: "0.75rem",
//         }}
//       >
//         {/* small semicircle top-right */}
//         <div
//           aria-hidden="true"
//           className="absolute right-[-16px] top-6 w-8 h-8 bg-white rounded-full shadow-sm"
//           style={{ pointerEvents: "none" }}
//         />

//         {/* small semicircle bottom-right */}
//         <div
//           aria-hidden="true"
//           className="absolute right-[-16px] bottom-6 w-8 h-8 bg-white rounded-full shadow-sm"
//           style={{ pointerEvents: "none" }}
//         />

//         {/* header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center gap-2">
//             <h3 className="font-semibold text-gray-900">
//               {type === "search" ? "Search" : "Notifications"}
//             </h3>
//             {type === "notifications" && (
//               <span className="text-xs text-gray-500">
//                 {notificationsState.length} items
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             {/* If notifications panel, show red Clear All in header */}
//             {type === "notifications" && (
//               <button
//                 onClick={clearNotifications}
//                 className="text-xs px-2 py-1 rounded-md border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition"
//                 title="Clear all notifications"
//               >
//                 Clear All
//               </button>
//             )}

//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-gray-100"
//             >
//               <FiX />
//             </button>
//           </div>
//         </div>

//         {/* content area (scrollable) */}
//         <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
//           {/* Search Panel */}
//           {type === "search" && (
//             <>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">
//                   Search blogs
//                 </label>

//                 <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
//                   <FiSearch className="text-gray-500" />
//                   <input
//                     type="text"
//                     placeholder="Search BlogVerse..."
//                     className="w-full text-sm outline-none"
//                     value={searchInput}
//                     onChange={(e) => setSearchInput(e.target.value)}
//                   />
//                   {searchInput && (
//                     <button
//                       onClick={() => setSearchInput("")}
//                       className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="text-xs font-semibold text-gray-700">
//                     Recent searches
//                   </h4>

//                   <button
//                     onClick={clearRecentSearches}
//                     className="text-xs px-2 py-1 rounded-md border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition"
//                   >
//                     Clear All
//                   </button>
//                 </div>

//                 {recentSearchesState.length === 0 ? (
//                   <div className="text-sm text-gray-500">No recent searches.</div>
//                 ) : (
//                   <ul className="space-y-2 text-sm text-gray-700">
//                     {recentSearchesState.map((item) => (
//                       <li
//                         key={item}
//                         className="px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </>
//           )}

//           {/* Notifications Panel */}
//           {type === "notifications" && (
//             <>
//               <h4 className="text-xs font-semibold text-gray-700 mb-2">Notifications</h4>

//               {notificationsState.length === 0 ? (
//                 <div className="text-sm text-gray-500">No notifications.</div>
//               ) : (
//                 <div className="space-y-3 text-sm">
//                   {notificationsState.map((n, idx) => (
//                     <div
//                       key={idx}
//                       className="p-3 rounded-lg bg-gray-50 border border-gray-100"
//                     >
//                       {n}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default function Home() {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState(initialPosts);
//   const [activeNav, setActiveNav] = useState("home");
//   const [sidePanel, setSidePanel] = useState(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   // Read user slice safely — backend payload shape may vary.
//   const stateUser = useSelector((s) => s.user);
//   // If the reducer stores the payload under `user` (state.user.user), use that; otherwise use the slice directly.
//   const userObj = stateUser && stateUser.user ? stateUser.user : stateUser;

//   const [notificationsState, setNotificationsState] =
//     useState(initialNotifications);
//   const [recentSearchesState, setRecentSearchesState] = useState(
//     initialRecentSearches
//   );

//   const handleOpenSearch = () => {
//     setSidePanel("search");
//     setActiveNav("search");
//   };

//   const handleOpenNotifications = () => {
//     setSidePanel("notifications");
//     setActiveNav("notifications");
//   };

//   const handleOpenCreate = () => {
//     setShowCreateModal(true);
//     setActiveNav("create");
//   };

//   const handleClosePanels = () => {
//     setSidePanel(null);
//   };

//   const handlePostBlog = (title, content) => {
//     const newPost = {
//       id: Date.now(),
//       author: "You",
//       content,
//       likes: 0,
//       comments: 0,
//       saves: 0,
//     };

//     setPosts((prev) => [newPost, ...prev]);
//     setShowCreateModal(false);
//     setActiveNav("home");
//   };

//   return (
//     <div className="min-h-screen w-full bg-gray-50 text-gray-900">
//       <div className="flex h-screen w-full">
//         <Navbar />

//         {/* RIGHT SIDE (SCROLLABLE) */}
//         <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
//           {/* HERO SECTION */}
//           <section className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-200 pb-6 text-center md:text-left">
//             <div className="flex-1 space-y-3">
//               <h1 className="text-3xl md:text-5xl font-bold leading-tight">
//                 Explore Stories,
//                 <br /> Ideas & Inspiration
//               </h1>

//               <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">
//                 Discover trending blogs from creators around the globe.
//               </p>
//             </div>

//             <div className="flex-1 flex justify-center">
//               <img
//                 src="/public/home page image.png"
//                 alt="hero"
//                 // className="w-full max-w-sm md:max-w-xl h-auto md:h-[300px] md:pr-20 object-contain"
//                 className="w-[650px] h-[300px] pr-[80px]"
//               />
//             </div>
//           </section>

//           {/* POSTS */}
//           <section className="flex flex-col gap-4">
//             <h2 className="text-xl font-semibold">Latest from your network</h2>

//             <div className="flex flex-col gap-4">
//               {posts.map((post) => (
//                 <PostCard key={post.id} post={post} />
//               ))}
//             </div>
//           </section>
//         </main>
//       </div>

//       {/* PANELS & MODALS */}
//       <SlidePanel
//         type={sidePanel}
//         onClose={handleClosePanels}
//         notificationsState={notificationsState}
//         setNotificationsState={setNotificationsState}
//         recentSearchesState={recentSearchesState}
//         setRecentSearchesState={setRecentSearchesState}
//       />
//       <CreateBlogModal
//         open={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onPost={handlePostBlog}
//       />
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CreateBlogModal from "./CreateBlogModal";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBell,
  FiEdit3,
  FiUserPlus,
  FiSettings,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useSelector } from "react-redux";

const initialPosts = [
  {
    id: 1,
    author: "Alex Johnson",
    content:
      "Exploring how small daily writing habits can transform your creativity over time.",
    likes: 12,
    comments: 4,
    saves: 3,
  },
  {
    id: 2,
    author: "Priya Sharma",
    content: "5 ways to make your blog more engaging for first-time visitors.",
    likes: 18,
    comments: 6,
    saves: 5,
  },
  {
    id: 3,
    author: "Michael Lee",
    content:
      "How I turned weekend journaling into a full-time blog in just one year.",
    likes: 25,
    comments: 10,
    saves: 9,
  },
  {
    id: 4,
    author: "Sara Wilson",
    content:
      "Design tips to make your blog posts more readable and visually pleasing.",
    likes: 9,
    comments: 2,
    saves: 4,
  },
  {
    id: 5,
    author: "David Kim",
    content:
      "Why storytelling is the most powerful tool for building a loyal audience.",
    likes: 31,
    comments: 12,
    saves: 15,
  },
  {
    id: 6,
    author: "Emily Brown",
    content:
      "Balancing authenticity and privacy while sharing your life online.",
    likes: 7,
    comments: 3,
    saves: 2,
  },
];

const initialNotifications = [
  "Priya commented on your post.",
  "You have 3 new followers.",
  "Your blog 'Daily Writing Habits' reached 1k views!",
  "Alex liked your recent blog.",
  "New recommendation: 'Top 10 productivity hacks'.",
  "Your profile was viewed 12 times today.",
  "Reminder: Finish your draft 'Travel Diaries'.",
  "Weekly digest is ready.",
  "New message from Sara.",
  "System: maintenance tonight.",
  "Tip: Add tags to increase discoverability.",
];

const initialRecentSearches = [
  "Productivity blogs",
  "Travel stories",
  "Tech trends 2025",
  "Minimalist lifestyle",
  "Personal finance tips",
  "Photography blogs",
  "Health & wellness",
];

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center md:gap-3 px-0 md:px-3 py-2 rounded-lg 
        w-14 md:w-full justify-center md:justify-start 
        text-sm font-medium transition
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        }`}
    >
      <Icon className="text-lg" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [saveCount, setSaveCount] = useState(post.saves);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
  };

  const handleSave = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    setSaveCount((c) => (newSaved ? c + 1 : Math.max(0, c - 1)));
  };

  const handleComment = () => {
    setCommentCount((c) => c + 1);
  };

  return (
    <div className="bg-gray-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
          <FiUser className="text-2xl text-purple-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{post.author}</span>
          <span className="text-xs text-gray-500">From your network</span>
        </div>
      </div>

      <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-6 pt-2 border-t border-gray-200">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
        >
          <FiHeart
            className={`text-lg ${
              liked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
          <span className={liked ? "text-red-500" : "text-gray-600"}>
            Like
          </span>
          <span className="text-[11px] text-gray-500">• {likeCount}</span>
        </button>

        <button
          onClick={handleComment}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-purple-600 hover:opacity-80 transition"
        >
          <FiMessageCircle className="text-lg" />
          <span>Comment</span>
          <span className="text-[11px] text-gray-500">• {commentCount}</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
        >
          <FiBookmark
            className={`text-lg ${
              saved ? "text-purple-600 fill-purple-600" : "text-gray-500"
            }`}
          />
          <span className={saved ? "text-purple-600" : "text-gray-600"}>
            Save
          </span>
          <span className="text-[11px] text-gray-500">• {saveCount}</span>
        </button>
      </div>
    </div>
  );
}

function SlidePanel({
  type,
  onClose,
  notificationsState,
  setNotificationsState,
  recentSearchesState,
  setRecentSearchesState,
}) {
  const isOpen = type !== null;
  const [searchInput, setSearchInput] = useState("");

  const clearRecentSearches = () => {
    setRecentSearchesState([]);
    setSearchInput("");
  };

  const clearNotifications = () => {
    setNotificationsState([]);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel container */}
      <div
        className={`fixed left-0 top-4 bottom-4 md:top-16 md:bottom-16 z-50 w-72 sm:w-80 bg-white shadow-lg transform transition-transform duration-300 overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          display: "flex",
          flexDirection: "column",
          borderTopRightRadius: "0.75rem",
          borderBottomRightRadius: "0.75rem",
        }}
      >
        {/* small semicircle top-right */}
        <div
          aria-hidden="true"
          className="absolute right-[-16px] top-6 w-8 h-8 bg-white rounded-full shadow-sm"
          style={{ pointerEvents: "none" }}
        />

        {/* small semicircle bottom-right */}
        <div
          aria-hidden="true"
          className="absolute right-[-16px] bottom-6 w-8 h-8 bg-white rounded-full shadow-sm"
          style={{ pointerEvents: "none" }}
        />

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {type === "search" ? "Search" : "Notifications"}
            </h3>
            {type === "notifications" && (
              <span className="text-xs text-gray-500">
                {notificationsState.length} items
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {type === "notifications" && (
              <button
                onClick={clearNotifications}
                className="text-xs px-2 py-1 rounded-md border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition"
                title="Clear all notifications"
              >
                Clear All
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* content area (scrollable) */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Search Panel */}
          {type === "search" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Search blogs
                </label>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <FiSearch className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search BlogVerse..."
                    className="w-full text-sm outline-none"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-700">
                    Recent searches
                  </h4>

                  <button
                    onClick={clearRecentSearches}
                    className="text-xs px-2 py-1 rounded-md border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition"
                  >
                    Clear All
                  </button>
                </div>

                {recentSearchesState.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No recent searches.
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {recentSearchesState.map((item) => (
                      <li
                        key={item}
                        className="px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Notifications Panel */}
          {type === "notifications" && (
            <>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Notifications
              </h4>

              {notificationsState.length === 0 ? (
                <div className="text-sm text-gray-500">No notifications.</div>
              ) : (
                <div className="space-y-3 text-sm">
                  {notificationsState.map((n, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
//   const navigate = useNavigate();

//   // ✅ Correct: read from auth slice
//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   // ✅ Optional: protect this page
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);


// // useEffect(() => {
// //   if (!isAuthenticated) {
// //     navigate("/");
// //   }
// // }, [isAuthenticated]);


//   const [posts, setPosts] = useState(initialPosts);
//   const [activeNav, setActiveNav] = useState("home");
//   const [sidePanel, setSidePanel] = useState(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);



  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

    // console.log("HOME RENDER", user, isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);


  const [posts, setPosts] = useState(initialPosts);
  const [activeNav, setActiveNav] = useState("home");
  const [sidePanel, setSidePanel] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  const [notificationsState, setNotificationsState] =
    useState(initialNotifications);
  const [recentSearchesState, setRecentSearchesState] = useState(
    initialRecentSearches
  );

  const handleOpenSearch = () => {
    setSidePanel("search");
    setActiveNav("search");
  };

  const handleOpenNotifications = () => {
    setSidePanel("notifications");
    setActiveNav("notifications");
  };

  const handleOpenCreate = () => {
    setShowCreateModal(true);
    setActiveNav("create");
  };

  const handleClosePanels = () => {
    setSidePanel(null);
  };

  const handlePostBlog = (title, content) => {
    const newPost = {
      id: Date.now(),
      author: user?.name || "You",
      content,
      likes: 0,
      comments: 0,
      saves: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
    setActiveNav("home");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex h-screen w-full">
        <Navbar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenSearch={handleOpenSearch}
          onOpenNotifications={handleOpenNotifications}
          onOpenCreate={handleOpenCreate}
        />

        {/* RIGHT SIDE (SCROLLABLE) */}
        <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
          {/* HERO SECTION */}
          <section className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-200 pb-6 text-center md:text-left">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Explore Stories,
                <br /> Ideas & Inspiration
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">
                Discover trending blogs from creators around the globe.
              </p>
            </div>

            <div className="flex-1 flex justify-center">
              {/* In Vite, /public files are served from root, so use `/home page image.png` */}
              <img
                src="/home page image.png"
                alt="hero"
                className="w-[650px] h-[300px] pr-[80px]"
              />
            </div>
          </section>

          {/* POSTS */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Latest from your network</h2>

            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* PANELS & MODALS */}
      <SlidePanel
        type={sidePanel}
        onClose={handleClosePanels}
        notificationsState={notificationsState}
        setNotificationsState={setNotificationsState}
        recentSearchesState={recentSearchesState}
        setRecentSearchesState={setRecentSearchesState}
      />
      <CreateBlogModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPost={handlePostBlog}
      />
    </div>
  );
}







