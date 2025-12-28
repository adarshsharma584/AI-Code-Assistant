import React, { useState, useEffect } from "react";
import { useAuth } from "../context/contexts-Files/authContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, loading, myProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    myProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="loader h-10 w-10 " />
      </div>
    );
  }

  const initials =
    profileData.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mt-16">
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {profileData.fullName}
          </h2>
          <p className="text-gray-500">@{profileData.username}</p>

          <div className="mt-4 text-sm text-gray-600">
            <p>📅 Joined recently</p>
            <p>🔥 Active user</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* PROFILE INFO */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Information
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <input
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({ ...profileData, username: e.target.value })
                  }
                  placeholder="Username"
                  className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Tell something about yourself..."
                  className="w-full h-28 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-md text-gray-600"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {profileData.fullName}
                </p>
                <p>
                  <strong>Username:</strong> @{profileData.username}
                </p>
                <p>
                  <strong>Email:</strong> {profileData.email}
                </p>
                <p className="sm:col-span-2">
                  <strong>Bio:</strong> {profileData.bio || "No bio added yet."}
                </p>
              </div>
            )}
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Account Overview
            </h3>

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="border rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">Sessions</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-sm text-gray-500">Roadmaps</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">Active</p>
                <p className="text-sm text-gray-500">Status</p>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>✅ Profile created</li>
              <li>🔐 Logged in securely</li>
              <li>🧠 Generated first roadmap</li>
              <li>🚀 Exploring tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
