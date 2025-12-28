import React, { useState, useEffect } from "react";
import { useAuth } from "../context/contexts-Files/authContext";

function Profile() {
  const { user, loading, myProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    myProfile();
  }, [myProfile]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const initials =
    profileData.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {profileData.fullName || "User"}
          </h2>
          <p className="text-gray-500">@{profileData.username}</p>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-5 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* ABOUT CARD */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <input
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({ ...profileData, username: e.target.value })
                  }
                  placeholder="Username"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Short bio..."
                  className="w-full h-28 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-md text-gray-600"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Save
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

          {/* ACTIVITY */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>✅ Profile created</li>
              <li>🔐 Logged in successfully</li>
              <li>🎉 Joined the platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
