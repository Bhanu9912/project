


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllBlogs, toggleLike, addComment } from "../../../BlogSlice";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import RightProfileCard from "./RightProfileCard";

/* ⭐ TIME AGO FORMATTER */
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
    <>
      

      {/* 🔁 RESPONSIVE LAYOUT */}
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">

        {/* ⭐ RIGHT PROFILE CARD (TOP ON MOBILE) */}
        <div className="order-1 md:order-2 md:w-[350px] w-full">
          <RightProfileCard postsCount={userPostsCount} />
        </div>

        {/* ⭐ BLOGS SECTION (BOTTOM ON MOBILE) */}
        <main className="order-2 md:order-1 flex-1 p-4 md:p-6 overflow-y-auto">
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

                      {/* SEE MORE */}
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
      </div>
    </>
  );
}
