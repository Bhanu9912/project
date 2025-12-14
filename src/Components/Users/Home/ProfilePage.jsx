

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Navbar from "./Navbar";
// import { getAllBlogs, toggleLike, addComment } from "../../../BlogSlice";
// import { FiHeart, FiMessageCircle } from "react-icons/fi";
// import RightProfileCard from "./RightProfileCard";

// // ⭐ TIME AGO FORMATTER
// function timeAgo(date) {
//   if (!date) return "";

//   const now = new Date();
//   const past = new Date(date);
//   const diff = (now - past) / 1000; // seconds difference

//   if (diff < 60) return "Just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

//   const days = Math.floor(diff / 86400);
//   if (days === 1) return "Yesterday";
//   if (days < 30) return `${days} days ago`;

//   const months = Math.floor(days / 30);
//   if (months < 12) return `${months} months ago`;

//   const years = Math.floor(months / 12);
//   return `${years} years ago`;
// }

// export default function ProfilePage() {
//   const dispatch = useDispatch();
//   const authUser = useSelector((state) => state.auth.user);
//   const me = authUser?.user ? authUser.user : authUser || {};
//   const myId = me?._id || "";

//   const { blogs = [], loading } = useSelector((state) => state.blogs);

//   const [openPost, setOpenPost] = useState(null);
//   const [commentText, setCommentText] = useState("");

//   // ⭐ Track opened comments for "see more"
//   const [showMoreFor, setShowMoreFor] = useState({});

//   useEffect(() => {
//     dispatch(getAllBlogs());
//   }, [dispatch]);

//   // ⭐ FILTER ONLY USER POSTS
//   const userBlogs = blogs.filter((b) => b?.user?._id === myId) || [];
//   const userPostsCount = userBlogs.length;

//   const handleLike = (id) => dispatch(toggleLike(id));

//   const handleSubmitComment = (blogId) => {
//     if (!commentText.trim()) return;
//     dispatch(addComment({ articleId: blogId, comment: commentText }));
//     setCommentText("");
//   };

//   const toggleComments = (id) =>
//     setOpenPost((prev) => (prev === id ? null : id));

//   const getAuthorName = () => me?.username || "Unknown User";

//   const getAvatar = () => (
//     <img
//       src={
//         me?.profilePhoto
//           ? `data:image/jpeg;base64,${me.profilePhoto}`
//           : "/default-avatar.png"
//       }
//       alt="photo"
//       className="w-12 h-12 rounded-full object-cover shadow"
//     />
//   );
//   console.log("auth user in profile page:", authUser);

//   return (
//     <div className="flex">
//       <Navbar />

//       <main className="flex-1 bg-gray-100 p-6 h-screen overflow-y-scroll">
//         <h2 className="text-2xl font-bold mb-4">Your Posts</h2>

//         {loading && <p>Loading blogs...</p>}

//         <div className="space-y-6">
//           {userBlogs.length === 0 && (
//             <p className="text-gray-500 text-lg">
//               You haven't posted anything yet.
//             </p>
//           )}

//           {userBlogs.map((blog) => {
//             const isLiked = blog.likes?.includes(myId);

//             return (
//               <div
//                 key={blog._id}
//                 className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border"
//               >
//                 {/* USER SECTION */}
//                 <div className="flex items-center gap-3 mb-4">
//                   {getAvatar()}
//                   <div>
//                     <p className="font-semibold text-lg">{getAuthorName()}</p>
//                     <p className="text-xs text-gray-400">{me?.email}</p>
//                   </div>
//                 </div>

//                 {/* ⭐ BLOG HEADER */}
//                 <div className="flex items-start justify-between">
//                   <h3 className="text-xl font-bold text-gray-900 mb-1">
//                     {blog.title}
//                   </h3>

//                   <div className="ml-4 flex-shrink-0">
//                     <p className="text-xs text-gray-400">
//                       {timeAgo(blog.createdAt)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* BLOG CONTENT */}
//                 <p className="text-gray-600 mb-4 whitespace-pre-wrap">
//                   {blog.content}
//                 </p>

//                 {/* LIKE + COMMENT */}
//                 <div className="flex items-center gap-8 mt-3 border-t pt-4">
//                   <button
//                     onClick={() => handleLike(blog._id)}
//                     className={`flex items-center gap-2 text-lg ${
//                       isLiked
//                         ? "text-red-500"
//                         : "text-gray-600 hover:text-red-500"
//                     }`}
//                   >
//                     <FiHeart
//                       className={isLiked ? "fill-red-500 text-red-500" : ""}
//                     />
//                     <span>{blog.likes?.length || 0}</span>
//                   </button>

//                   <button
//                     onClick={() => toggleComments(blog._id)}
//                     className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-lg"
//                   >
//                     <FiMessageCircle />
//                     <span>{blog.comments?.length || 0}</span>
//                   </button>
//                 </div>

//                 {/* ⭐ COMMENTS SECTION */}
//                 {openPost === blog._id && (
//                   <div className="mt-5 bg-gray-50 p-4 rounded-xl border space-y-4">
//                     {/* COMMENT INPUT */}
//                     <div className="flex gap-3">
//                       <input
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         className="flex-1 border rounded-xl px-4 py-2 focus:ring"
//                         placeholder="Write a comment..."
//                       />
//                       <button
//                         onClick={() => handleSubmitComment(blog._id)}
//                         className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
//                       >
//                         Post
//                       </button>
//                     </div>

//                     {/* ⭐ COMMENT LIST + SHOW MORE */}
//                     <div className="space-y-3">
//                       {(() => {
//                         if (!blog.comments?.length) {
//                           return (
//                             <p className="text-gray-400 text-sm">
//                               No comments yet.
//                             </p>
//                           );
//                         }

//                         // NEWEST FIRST
//                         const sorted = [...blog.comments].sort(
//                           (a, b) =>
//                             new Date(b.createdAt) - new Date(a.createdAt)
//                         );

//                         const showAll = showMoreFor[blog._id];
//                         const visible = showAll
//                           ? sorted
//                           : sorted.slice(0, 3);

//                         return (
//                           <>
//                             {visible.map((c, i) => (
//                               <div
//                                 key={i}
//                                 className="bg-white border p-3 rounded-lg text-sm flex flex-col gap-1"
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <b className="text-gray-800">
//                                     {c.username || me.username}
//                                   </b>

//                                   {/* TIME AGO */}
//                                   <span className="text-[10px] text-gray-400">
//                                     {timeAgo(c.createdAt)}
//                                   </span>
//                                 </div>

//                                 <span className="text-gray-700">
//                                   {c.text}
//                                 </span>
//                               </div>
//                             ))}

//                             {/* SEE MORE / SEE LESS BUTTON */}
//                             {sorted.length > 3 && (
//                               <button
//                                 onClick={() =>
//                                   setShowMoreFor({
//                                     ...showMoreFor,
//                                     [blog._id]:
//                                       !showMoreFor[blog._id],
//                                   })
//                                 }
//                                 className="text-blue-600 text-xs mt-1 hover:underline"
//                               >
//                                 {showMoreFor[blog._id]
//                                   ? "See less"
//                                   : `See more (${sorted.length - 3})`}
//                               </button>
//                             )}
//                           </>
//                         );
//                       })()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       <RightProfileCard postsCount={userPostsCount} />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import { getAllBlogs, toggleLike, addComment } from "../../../BlogSlice";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import RightProfileCard from "./RightProfileCard";

// ⭐ TIME AGO FORMATTER
function timeAgo(date) {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diff = (now - past) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  const days = Math.floor(diff / 86400);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  return `${Math.floor(months / 12)} years ago`;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const me = authUser?.user || {};
  const myId = me?._id || "";

  const { blogs = [], loading } = useSelector((state) => state.blogs);

  const [openPost, setOpenPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showMoreFor, setShowMoreFor] = useState({});

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const userBlogs = blogs.filter((b) => b?.user?._id === myId) || [];
  const userPostsCount = userBlogs.length;

  const handleLike = (id) => dispatch(toggleLike(id));

  const handleSubmitComment = (blogId) => {
    if (!commentText.trim()) return;
    dispatch(addComment({ articleId: blogId, comment: commentText }));
    setCommentText("");
  };

  const toggleComments = (id) =>
    setOpenPost((prev) => (prev === id ? null : id));

  const getAvatar = () => (
    <img
      src={
        me?.profilePhoto
          ? `data:image/jpeg;base64,${me.profilePhoto}`
          : "/default-avatar.png"
      }
      alt="photo"
      className="w-12 h-12 rounded-full object-cover shadow"
    />
  );

  return (
    <div className="flex">
      <Navbar />

      <main className="flex-1 bg-gray-100 p-6 h-screen overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>

        {loading && <p>Loading blogs...</p>}

        <div className="space-y-6">
          {userBlogs.map((blog) => {
            const isLiked = blog.likes?.includes(myId);
            const sortedComments = [...(blog.comments || [])].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            const showAll = showMoreFor[blog._id];
            const visibleComments = showAll
              ? sortedComments
              : sortedComments.slice(0, 3);

            return (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg p-6 border"
              >
                {/* USER */}
                <div className="flex items-center gap-3 mb-4">
                  {getAvatar()}
                  <div>
                    <p className="font-semibold text-lg">{me.username}</p>
                    <p className="text-xs text-gray-400">{me.email}</p>
                  </div>
                </div>

                {/* TITLE */}
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-bold">{blog.title}</h3>
                  <span className="text-xs text-gray-400">
                    {timeAgo(blog.createdAt)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{blog.content}</p>

                {/* ❤️ LIKE + COMMENT */}
                <div className="flex justify-end border-t pt-4">
                  <div className="flex gap-6 text-sm text-gray-600">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="flex items-center gap-2"
                    >
                      <FiHeart
                        className={`text-lg transition-transform duration-300 ${
                          isLiked
                            ? "text-red-500 fill-red-500 scale-125"
                            : "text-gray-500"
                        }`}
                      />
                      Like · {blog.likes?.length || 0}
                    </button>

                    <button
                      onClick={() => toggleComments(blog._id)}
                      className="flex items-center gap-2"
                    >
                      <FiMessageCircle className="text-lg" />
                      Comments · {blog.comments?.length || 0}
                    </button>
                  </div>
                </div>

                {/* 💬 COMMENTS */}
                {openPost === blog._id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl border space-y-3">
                    {/* INPUT */}
                    <div className="flex gap-2">
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 border rounded-xl px-4 py-2"
                        placeholder="Write a comment..."
                      />
                      <button
                        onClick={() => handleSubmitComment(blog._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                      >
                        Post
                      </button>
                    </div>

                    {/* LIST */}
                    {visibleComments.map((c, i) => (
                      <div
                        key={i}
                        className="bg-white p-3 rounded-lg text-sm"
                      >
                        <div className="flex justify-between">
                          <b>{c.username}</b>
                          <span className="text-[10px] text-gray-400">
                            {timeAgo(c.createdAt)}
                          </span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))}

                    {/* SEE MORE / LESS */}
                    {sortedComments.length > 3 && (
                      <button
                        onClick={() =>
                          setShowMoreFor((p) => ({
                            ...p,
                            [blog._id]: !p[blog._id],
                          }))
                        }
                        className="text-blue-600 text-xs hover:underline"
                      >
                        {showAll
                          ? "See less"
                          : `See more (${sortedComments.length - 3})`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <RightProfileCard postsCount={userPostsCount} />
    </div>
  );
}
