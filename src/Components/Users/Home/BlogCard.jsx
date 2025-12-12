import React, { useState, useMemo } from "react";
import { FiHeart, FiMessageCircle, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../../../BlogSlice";
import BlogComments from "./BlogComments";

function getProfileSrc(profilePhoto) {
  if (!profilePhoto) return null;
  if (typeof profilePhoto === "string") {
    if (profilePhoto.startsWith("data:")) return profilePhoto;
    return `data:image/jpeg;base64,${profilePhoto}`;
  }
  if (profilePhoto?.data) {
    try {
      const bytes = Uint8Array.from(profilePhoto.data);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return `data:image/jpeg;base64,${window.btoa(binary)}`;
    } catch {
      return null;
    }
  }
  return null;
}

// TIME AGO
function timeAgo(time) {
  if (!time) return "";
  const now = new Date();
  const t = new Date(time);
  const diff = (now - t) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  const days = Math.floor(diff / 86400);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  return `${Math.floor(months / 12)} years ago`;
}

export default function BlogCard({ blog }) {
  const dispatch = useDispatch();
  const [openComments, setOpenComments] = useState(false);

  const auth = useSelector((state) => state.auth.user);
  const userId = auth?.user?._id || auth?._id;

  const isLiked = blog.likes?.includes(userId);

  const profileSrc = useMemo(
    () => getProfileSrc(blog?.user?.profilePhoto),
    [blog?.user?.profilePhoto]
  );

  return (
    <div className="bg-gray-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-200 flex items-center justify-center">
            {profileSrc ? (
              <img src={profileSrc} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-2xl text-purple-600" />
            )}
          </div>

          <div className="flex flex-col">
            {/* ⭐ EMAIL: Bigger + Bold */}
            <span className="text-base font-bold text-gray-900">
              {blog?.user?.email}
            </span>
          </div>
        </div>

        <span className="text-[11px] text-gray-500">{timeAgo(blog.createdAt)}</span>
      </div>

      {/* BLOG TITLE (Bigger + semi-bold) */}
      <p className="text-lg font-semibold text-gray-800">{blog.title}</p>

      {/* BLOG CONTENT */}
      <p className="text-gray-700 text-sm">{blog.content}</p>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-6 pt-2 border-t">

        <button
          onClick={() => dispatch(toggleLike(blog._id))}
          className="flex items-center gap-1 text-xs"
        >
          <FiHeart
            className={`text-lg ${
              isLiked ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
          <span className={isLiked ? "text-red-500" : "text-gray-600"}>
            Like
          </span>
          <span className="text-[11px] text-gray-500">
            • {blog.likes?.length || 0}
          </span>
        </button>

        <div
          onClick={() => setOpenComments(!openComments)}
          className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer hover:text-purple-600"
        >
          <FiMessageCircle className="text-lg" />
          <span>Comments</span>
          <span className="text-[11px] text-gray-500">
            • {blog.comments?.length}
          </span>
        </div>
      </div>

      {/* INLINE COMMENTS */}
      {openComments && <BlogComments blog={blog} />}
    </div>
  );
}

