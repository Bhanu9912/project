



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import { getAllBlogs, toggleLike, addComment } from "../../../BlogSlice";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import RightProfileCard from "./RightProfileCard";

export default function ProfilePage() {
  const dispatch = useDispatch();

  // AUTH USER → may be { user:{...}, token } OR user object
  const authUser = useSelector((state) => state.auth.user);
  const me = authUser?.user ? authUser.user : authUser || {};
  const myId = me?._id || "";

  const { blogs = [], loading } = useSelector((state) => state.blogs);

  const [openPost, setOpenPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // ✅ FILTER POSTS BELONGING TO LOGGED-IN USER
  const userBlogs =
    blogs.filter((b) => b?.user?._id === myId) || [];

  // Count My Posts
  const userPostsCount = userBlogs.length;

  // Like Handler
  const handleLike = (id) => dispatch(toggleLike(id));

  // Comment Handler
  const handleSubmitComment = (blogId) => {
    if (!commentText.trim()) return;
    dispatch(addComment({ articleId: blogId, comment: commentText }));
    setCommentText("");
  };

  // Toggle Comments
  const toggleComments = (id) =>
    setOpenPost((prev) => (prev === id ? null : id));

  // Author Name (my profile only)
  const getAuthorName = () => me?.username || "Unknown User";

  // Avatar (my profile only)
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
  // console.log("authUser:", authUser);

  return (
    <div className="flex">
      <Navbar />

      <main className="flex-1 bg-gray-100 p-6 h-screen overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>

        {loading && <p>Loading blogs...</p>}

        <div className="space-y-6">
          {/* IF NO POSTS */}
          {userBlogs.length === 0 && (
            <p className="text-gray-500 text-lg">You haven't posted anything yet.</p>
          )}

          {/* SHOW ONLY MY POSTS */}
          {userBlogs.map((blog) => {
            const isLiked = blog.likes?.includes(myId);

            return (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border"
              >
                {/* USER SECTION */}
                <div className="flex items-center gap-3 mb-4">
                  {getAvatar()}
                  <div>
                    <p className="font-semibold text-lg">{getAuthorName()}</p>
                    <p className="text-xs text-gray-400">{me?.email}</p>
                  </div>
                </div>

                {/* BLOG TITLE */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {blog.title}
                </h3>

                {/* BLOG CONTENT */}
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {blog.content}
                </p>

                {/* LIKE + COMMENT */}
                <div className="flex items-center gap-8 mt-3 border-t pt-4">
                  <button
                    onClick={() => handleLike(blog._id)}
                    className={`flex items-center gap-2 text-lg ${
                      isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <FiHeart className={isLiked ? "fill-red-500 text-red-500" : ""} />
                    <span>{blog.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(blog._id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-lg"
                  >
                    <FiMessageCircle />
                    <span>{blog.comments?.length || 0}</span>
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                {openPost === blog._id && (
                  <div className="mt-5 bg-gray-50 p-4 rounded-xl border space-y-4">
                    {/* COMMENT INPUT */}
                    <div className="flex gap-3">
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 border rounded-xl px-4 py-2 focus:ring"
                        placeholder="Write a comment..."
                      />
                      <button
                        onClick={() => handleSubmitComment(blog._id)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>

                    {/* COMMENT LIST */}
                    <div className="space-y-3">
                      {blog.comments?.length ? (
                        blog.comments.map((c, i) => (
                          <div
                            key={i}
                            className="bg-white border p-3 rounded-lg text-sm"
                          >
                            <b className="text-gray-800">
                              {c.username || me.username}:
                            </b>{" "}
                            <span>{c.text}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No comments yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <RightProfileCard postsCount={userPostsCount} />
    </div>
  );
}
