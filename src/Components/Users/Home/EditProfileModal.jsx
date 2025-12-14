import React, { useState } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const currentUser = user?.user || {};

  const [username, setUsername] = useState(currentUser.username || "");
  const [preview, setPreview] = useState(
    currentUser.profilePhoto
      ? `data:image/jpeg;base64,${currentUser.profilePhoto}`
      : null
  );
  const [photoBase64, setPhotoBase64] = useState(
    currentUser.profilePhoto || null
  );

  // ⭐ HANDLE IMAGE CHANGE
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setPreview(reader.result);
      setPhotoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      user: {
        username,
        profilePhoto: photoBase64,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[380px] p-6 shadow-xl">

        <h2 className="text-xl font-bold mb-5 text-center">
          Edit Profile
        </h2>

        {/* PROFILE PHOTO */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Photo
              </div>
            )}
          </div>

          <label className="cursor-pointer text-sm text-purple-600 font-medium">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        {/* USERNAME */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 block mb-1">
            Username
          </label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
