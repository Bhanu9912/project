import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiHome,
  FiPlus,
  FiSettings,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";

export default function Home() {
  const [activeButton, setActiveButton] = useState("");
  const navigate = useNavigate();

  const [feed, setFeed] = useState([
    { id: 1, title: "First content from your network", author: "Alice" },
    { id: 2, title: "Another content update", author: "Bob" },
    { id: 3, title: "Yet another content", author: "Carol" },
  ]);

  const [people, setPeople] = useState([
    { id: 1, name: "ABC", avatar: "A", added: false },
    { id: 2, name: "DEF", avatar: "D", added: false },
    { id: 3, name: "GHI", avatar: "G", added: false },
  ]);

  const [search, setSearch] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Alice liked your post", read: false },
    { id: 2, text: "New comment from Bob", read: false },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const peopleRef = useRef(null);
  const feedRef = useRef(null);

  const filteredFeed = feed.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "addfriends") {
      peopleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (buttonName === "newpost") {
      setShowNewPost(true);
    }
    if (buttonName === "home") {
      feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (buttonName === "notification") {
      setShowNotif((s) => !s);
    }
    if (buttonName === "profile") {
      setShowProfile((s) => !s);
    }
    if (buttonName === "logout") {
      // navigate to logout route
      navigate("/logout");
    }
  };

  const toggleAdd = (id) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, added: !p.added } : p))
    );
  };

  const removePerson = (id) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  const submitNewPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newItem = { id: Date.now(), title: newPostText.trim(), author: "You" };
    setFeed((prev) => [newItem, ...prev]);
    setNewPostText("");
    setShowNewPost(false);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowNotif(false);
  };

  useEffect(() => {
    const onClick = (e) => {
      const notifEl = document.getElementById("notif-dropdown");
      const bellEl = document.getElementById("notif-bell");
      if (
        notifEl &&
        !notifEl.contains(e.target) &&
        bellEl &&
        !bellEl.contains(e.target)
      ) {
        setShowNotif(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans w-full">
      <div className="w-full grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <aside className="col-span-3 bg-white rounded-lg shadow-sm p-6 sticky top-6 h-[calc(100vh-48px)] overflow-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold">
              B
            </div>
            <h2 className="text-xl font-semibold">Blogger</h2>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-4xl text-purple-700">
              👤
            </div>
            <p className="mt-3 text-gray-700">username</p>
            <button
              onClick={() => handleButtonClick("profile")}
              className="mt-2 bg-violet-600 text-white px-4 py-1 rounded-full text-sm"
            >
              MyProfile
            </button>
          </div>

          <nav className="mt-6 grid gap-3">
            <button
              onClick={() => handleButtonClick("home")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "home" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              <FiHome /> Home
            </button>
            <button
              onClick={() => handleButtonClick("newpost")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "newpost"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <FiPlus /> New Post+
            </button>
            <button
              onClick={() => handleButtonClick("addfriends")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "addfriends"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <FiUserPlus /> Add Friends+
            </button>
            <button
              id="notif-bell"
              onClick={() => handleButtonClick("notification")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "notification"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <FiBell /> Notification
            </button>
            <button
              onClick={() => handleButtonClick("settings")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "settings"
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              <FiSettings /> Settings
            </button>

            <button
              onClick={() => handleButtonClick("logout")}
              className={`border rounded-md p-3 text-left flex items-center gap-2 ${
                activeButton === "logout"
                  ? "bg-red-500 text-white"
                  : "bg-white text-red-600"
              }`}
            >
              <FiLogOut /> Logout
            </button>
          </nav>

          {showProfile && (
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <h4 className="font-semibold">Profile</h4>
              <p className="text-sm text-gray-600">username • blogger</p>
              <button className="mt-3 px-3 py-1 rounded-md bg-white border">
                Edit profile
              </button>
            </div>
          )}

          {showNotif && (
            <div id="notif-dropdown" className="mt-4 bg-white border rounded-md p-3">
              <div className="flex justify-between items-center">
                <strong>Notifications</strong>
                <button onClick={markAllRead} className="text-sm text-blue-500">
                  Mark all
                </button>
              </div>
              <ul className="mt-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`text-sm py-1 ${n.read ? "text-gray-400" : "text-gray-800"}`}
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main column */}
        <main className="col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 w-full">
              <div className="relative flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border px-4 py-2 pl-10 bg-white shadow-sm"
                  placeholder="Search posts or authors.."
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div className="ml-4 text-2xl text-yellow-600 relative">
              <FiBell />
            </div>
          </div>

          <section ref={feedRef} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Latest from your network</h3>
            <div className="border-t border-gray-200 mt-2" />

            <div className="space-y-6 mt-4">
              {filteredFeed.length === 0 && (
                <div className="text-center text-gray-500 py-8">No posts match your search.</div>
              )}
              {filteredFeed.map((f) => (
                <article key={f.id} className="py-6 border-b border-gray-100">
                  <h4 className="font-bold text-xl">{f.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">by {f.author}</p>
                </article>
              ))}
            </div>

            {/* Friends section below latest */}
            <div ref={peopleRef} className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">People you may know</h4>
                <button
                  onClick={() => alert("Show all people (placeholder)")}
                  className="text-sm text-violet-600"
                >
                  see all
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {people.map((p) => (
                  <div key={p.id} className="bg-gray-50 rounded-md p-4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-2xl text-purple-700">
                      {p.avatar}
                    </div>
                    <div className="mt-3 font-semibold">{p.name}</div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => toggleAdd(p.id)}
                        className={`px-4 py-2 rounded-md border ${p.added ? "bg-blue-500 text-white border-blue-500" : "bg-white"}`}
                      >
                        {p.added ? "Added" : "Add"}
                      </button>
                      <button
                        onClick={() => removePerson(p.id)}
                        className="px-4 py-2 rounded-md border bg-white text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* New post modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={submitNewPost} className="bg-white rounded-md p-6 w-full max-w-lg">
            <h4 className="text-lg font-bold mb-3">Create new post</h4>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              rows={5}
              className="w-full border rounded-md p-2"
              placeholder="What's on your mind?"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowNewPost(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
