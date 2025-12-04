

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import { getAllBlogs, toggleLike, addComment } from "../../../BlogSlice";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import RightProfileCard from "./RightProfileCard";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { blogs, loading } = useSelector((state) => state.blogs);

  const [openPost, setOpenPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const userPostsCount =
    blogs?.filter((b) => b?.author?._id === user?._id).length || 0;

  const handleLike = (id) => dispatch(toggleLike(id));

  const handleSubmitComment = (blogId) => {
    if (!commentText.trim()) return;
    dispatch(addComment({ articleId: blogId, comment: commentText }));
    setCommentText("");
  };

  const toggleComments = (id) =>
    setOpenPost((prev) => (prev === id ? null : id));

  const getAuthorName = (blog) => blog?.author?.username || user?.username;

  const getAvatarLetter = (blog) =>
    (getAuthorName(blog)?.[0] || "U").toUpperCase();

  return (
    <div className="flex">
      <Navbar />

      <main className="flex-1 bg-gray-100 p-6 h-screen overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>

        {loading && <p>Loading blogs...</p>}

        <div className="space-y-6">
          {blogs?.map((blog) => {
            const isLiked = blog.likes?.includes(user?._id);

            return (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-md p-6 border"
              >

                {/* USER */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                    {getAvatarLetter(blog)}
                  </div>
                  <div>
                    <p className="font-semibold">{getAuthorName(blog)}</p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold">{blog.title}</h3>

                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {blog.content}
                </p>

                {/* LIKE / COMMENT */}
                <div className="flex items-center gap-6 mt-4">
                  <button
                    onClick={() => handleLike(blog._id)}
                    className={`flex items-center gap-2 ${
                      isLiked ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    <FiHeart
                      className={`text-lg ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {blog.likes?.length || 0}
                  </button>

                  <button
                    onClick={() => toggleComments(blog._id)}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <FiMessageCircle className="text-lg" />
                    {blog.comments?.length || 0}
                  </button>
                </div>

                {/* COMMENTS */}
                {openPost === blog._id && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 border rounded-xl px-3 py-2"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        onClick={() => handleSubmitComment(blog._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                      >
                        Post
                      </button>
                    </div>

                    <div className="space-y-2">
                      {blog.comments?.length ? (
                        blog.comments.map((c, i) => (
                          <div
                            key={i}
                            className="bg-gray-100 p-2 rounded-lg border text-sm"
                          >
                            <b>{c.username || "User"}:</b> {c.text}
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

      <RightProfileCard postsCount={userPostsCount} />
    </div>
  );
}
