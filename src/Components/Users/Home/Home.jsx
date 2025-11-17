
import React, { useState } from "react";
import {
  FiSearch,
  FiHome,
  FiPlus,
  FiUserPlus,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Home() {
  const [active, setActive] = useState("Home");
  const [showNewPost, setShowNewPost] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [posts, setPosts] = useState([
    { id: 1, author: "Asha", title: "Hello", content: "First content sample" },
    { id: 2, author: "Ravi", title: "Update", content: "Second content sample" },
    { id: 3, author: "Megha", title: "Good Day", content: "It's a sunny day!" },
    { id: 4, author: "Rohan", title: "Travel", content: "Exploring new places!" },
    { id: 5, author: "Kiran", title: "Fitness", content: "Morning workout done!" },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Asha liked your post", read: false },
    { id: 2, text: "Ravi started following you", read: false },
    { id: 3, text: "Megha shared your post", read: false },
    { id: 4, text: "Kiran commented on your post", read: false },
  ]);
  const [user, setUser] = useState({ name: "username" });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSidebarClick(name) {
    setActive(name);

    if (name === "New Post+") {
      setShowNewPost(true);
      setShowNotificationsModal(false);
    } else if (name === "Notification") {
      setShowNotificationsModal(true);
      setShowNewPost(false);
    } else {
      setShowNewPost(false);
      setShowNotificationsModal(false);
    }
  }

  function submitPost(e) {
    e.preventDefault();
    if (!content.trim()) return alert("Please add content.");
    const newPost = {
      id: Date.now(),
      author: user.name,
      title: title || "Untitled",
      content: content,
    };
    setPosts((p) => [newPost, ...p]);
    setNotifications((n) => [
      { id: Date.now(), text: `${user.name} created a post`, read: false },
      ...n,
    ]);
    setTitle("");
    setContent("");
    setShowNewPost(false);
    setActive("Home");
  }

  function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      setUser(null);
      setActive("");
      alert("Logged out (demo).");
    }
  }

  function markAllRead() {
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
  }

  function toggleNotificationsFromHeader() {
    setShowNotificationsModal((s) => !s);
    setActive("Notification");
    setShowNewPost(false);
  }

  return (
    <div className="min-h-screen bg-white flex text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 border-r px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
            B
          </div>
          <h1 className="text-2xl font-semibold">Blogger</h1>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-36 h-36 rounded-full bg-purple-100 flex items-center justify-center">
            <div className="text-6xl text-purple-500">👤</div>
          </div>
          <div className="mt-3 text-lg">{user ? user.name : "Guest"}</div>
          <button
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-md"
            onClick={() => alert("Go to profile (demo)")}
          >
            MyProfile
          </button>
        </div>

        <nav className="space-y-4">
          {[
            { name: "Home", icon: <FiHome /> },
            { name: "New Post+", icon: <FiPlus /> },
            { name: "Add Friends+", icon: <FiUserPlus /> },
            { name: "Notification", icon: <FiBell /> },
            { name: "Settings", icon: <FiSettings /> },
          ].map((item) => {
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleSidebarClick(item.name)}
                className={`flex items-center gap-3 w-full justify-between border rounded px-4 py-3 text-left
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-900"
                  }
                  hover:shadow-sm transition`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-lg">{item.name}</span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => {
              setActive("Logout");
              handleLogout();
            }}
            className={`flex items-center gap-3 w-full justify-between border rounded px-4 py-3 text-left
              ${
                active === "Logout"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xl ${
                  active === "Logout" ? "text-white" : "text-gray-600"
                }`}
              >
                <FiLogOut />
              </span>
              <span className="text-lg">Logout</span>
            </div>
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Header with big full-width search bar up to notification icon */}
        <header className="flex items-center justify-between mb-6 w-full">
          <div className="relative flex-1 mr-6">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search.."
              className="w-full border rounded-full py-3 pl-12 pr-4 outline-none text-lg"
            />
          </div>

          <button
            onClick={toggleNotificationsFromHeader}
            className={`relative p-3 rounded-full ${
              showNotificationsModal
                ? "bg-blue-600 text-white"
                : "bg-transparent text-gray-800"
            }`}
            aria-label="Toggle notifications"
          >
            <FiBell className="text-2xl" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                !
              </span>
            )}
          </button>
        </header>

        <h2 className="text-3xl font-bold mb-4">Latest from your network</h2>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="space-y-6">
              {posts.map((p) => (
                <article key={p.id} className="border-b pb-6">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      👤
                    </div>
                    <div>
                      <div className="font-semibold">{p.author}</div>
                      <div className="text-2xl font-extrabold mt-2">
                        {p.title}
                      </div>
                    </div>
                  </div>
                  <p className="pl-16 text-lg">{p.content}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-2/3 max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Create New Post</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            <form onSubmit={submitPost} className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full border rounded px-3 py-2 outline-none"
              />
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
                className="w-full border rounded px-3 py-2 h-36 outline-none"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
        >
          <div className="bg-white rounded-lg w-96 max-w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <button onClick={markAllRead} className="text-sm underline">
                  Mark all read
                </button>
                <button
                  onClick={() => {
                    setShowNotificationsModal(false);
                    setActive("Home");
                  }}
                  className="text-gray-500"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3">
              {notifications.length === 0 && (
                <div className="text-sm text-gray-500">No notifications</div>
              )}
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded flex items-start gap-3 ${
                    n.read ? "bg-gray-100" : "bg-white shadow-sm"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    🔔
                  </div>
                  <div>
                    <div className="text-sm">{n.text}</div>
                    <div className="text-xs text-gray-400">
                      {n.read ? "Read" : "New"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


