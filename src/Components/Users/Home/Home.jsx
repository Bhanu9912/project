


import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CreateBlogModal from "./CreateBlogModal";
import { useSelector, useDispatch } from "react-redux";

import { getAllBlogs } from "../../../BlogSlice";
import BlogCard from "./BlogCard";

export default function Home() {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const blogs = useSelector((state) => state.blogs.blogs);

  // ⭐ FIX: USE AUTH USER (NOT friendsSlice)
  const authUser = useSelector((state) => state.auth.user);
  const me = authUser?.user || {};

  // Fetch blogs AFTER login
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllBlogs());
    }
  }, [isAuthenticated, dispatch]);

  // ⭐ FIX: FOLLOWERS + FOLLOWING IDS
  const friendIds = [
    ...(me.followers || []),
    ...(me.following || []),
  ].map((u) => u._id);

  // ⭐ Show blogs only from followers / following
  const visibleBlogs = blogs.filter((b) => {
    const authorId = b.user?._id || b.user;
    return friendIds.includes(authorId);
  });

  const [activeNav, setActiveNav] = useState("home");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreate = () => {
    setShowCreateModal(true);
    setActiveNav("create");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex h-screen w-full">

        {/* <Navbar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenCreate={handleOpenCreate}
        /> */}

        <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
        {/* <main className="flex-1 h-screen overflow-y-auto 
                 p-4 md:p-8 
                 flex flex-col gap-6
                 md:ml-64 pb-16 md:pb-0"> */}


          {/* HERO */}
          <section className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-200 pb-6 text-center md:text-left">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Explore Stories,
                <br /> Ideas & Inspiration
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">
                Discover trending blogs from your network.
              </p>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src="/home page image.png"
                alt="hero"
                className="w-[650px] h-[300px] pr-[80px]"
              />
            </div>
          </section>

          {/* BLOG FEED */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
              Latest from your network
            </h2>

            <div className="flex flex-col gap-4">
              {visibleBlogs.length === 0 ? (
                <p className="text-gray-500">
                  No posts from your friends yet.
                </p>
              ) : (
                visibleBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL */}
      <CreateBlogModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
