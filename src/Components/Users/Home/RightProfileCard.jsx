

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EditProfileModal from "./EditProfileModal";


export default function RightProfileCard({ postsCount }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);

  const handleSave = (data) => {
    dispatch(updateProfile(data));
  };

  return (
    <>
      {/* ✅ SHOW ON ALL SCREENS */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        {/* Sticky only on desktop */}
        <div className="lg:sticky lg:top-6 px-4 lg:px-0">

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-4">

            {/* USER INFO */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={
                  user?.user?.profilePhoto
                    ? `data:image/jpeg;base64,${user.user.profilePhoto}`
                    : "/default-avatar.png"
                }
                className="w-24 h-24 rounded-full object-cover shadow mb-3"
                alt="profile"
              />
              <div className="font-semibold text-lg">
                {user?.user?.username}
              </div>
              <div className="text-gray-500 text-sm">
                {user?.user?.email}
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 text-center mb-6 text-sm">
              <div>
                <div className="text-xs text-gray-500">Posts</div>
                <div className="font-semibold mt-1">{postsCount}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Followers</div>
                <div className="font-semibold mt-1">
                  {user?.user?.followers?.length ?? 0}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Following</div>
                <div className="font-semibold mt-1">
                  {user?.user?.following?.length ?? 0}
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={() => setOpenEdit(true)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow text-sm"
            >
              Edit Profile
            </button>

          </div>
        </div>
      </aside>

      {/* MODAL */}
      {openEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setOpenEdit(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

