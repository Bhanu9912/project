import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../../BlogSlice";

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

export default function BlogComments({ blog }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [showMore, setShowMore] = useState(false);

  const sorted = [...(blog.comments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const visible = showMore ? sorted : sorted.slice(0, 3);

  const postComment = () => {
    if (!commentText.trim()) return;

    dispatch(
      addComment({
        articleId: blog._id,
        comment: commentText,
      })
    );

    setCommentText(""); // comment should NOT close box
  };

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-xl border space-y-3">

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded text-sm"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <button
          onClick={postComment}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {/* LIST */}
      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      ) : (
        <>
          {visible.map((c, i) => (
            <div key={i} className="border-b pb-2 text-sm">
              <div className="flex justify-between">
                <b>{c.username || "User"}</b>
                <span className="text-[10px] text-gray-500">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p>{c.text}</p>
            </div>
          ))}

          {/* SEE MORE */}
          {sorted.length > 3 && (
            <button
              onClick={() => setShowMore((p) => !p)}
              className="text-blue-600 text-xs hover:underline"
            >
              {showMore
                ? "See less"
                : `See more (${sorted.length - 3})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
