import React, { useState, useEffect } from "react";
import { useAuth } from "../context/contexts-Files/authContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiEdit2, FiCheck, FiX, FiActivity, FiMap, FiClock } from "react-icons/fi";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loader h-10 w-10" />
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
      <div className="max-w-6xl mx-auto mt-16">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">
              {initials}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
              <p className="text-blue-100 text-lg mb-3">@{profileData.username}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  🔥 Active User
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  📅 Member Since 2024
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md"
            >
              {isEditing ? (
                <>
                  <FiX /> Cancel
                </>
              ) : (
                <>
                  <FiEdit2 /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiActivity className="text-blue-600" />
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <FiClock />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                      <FiMap />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Roadmaps</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                      <FiActivity />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✅</span>
                  <span>Profile created</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">🔐</span>
                  <span>Logged in securely</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">🧠</span>
                  <span>Generated first roadmap</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 mt-0.5">🚀</span>
                  <span>Exploring tools</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Profile Information
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, fullName: e.target.value })
                      }
                      placeholder="Full Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({ ...profileData, username: e.target.value })
                      }
                      placeholder="Username"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      placeholder="Tell something about yourself..."
                      className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <FiX /> Cancel
                    </button>
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                      <FiCheck /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Full Name</p>
                      <p className="text-base font-semibold text-gray-900">{profileData.fullName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Username</p>
                      <p className="text-base font-semibold text-gray-900">@{profileData.username}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                      <FiMail className="text-blue-600" /> Email
                    </p>
                    <p className="text-base font-semibold text-gray-900">{profileData.email}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Bio</p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {profileData.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/tools')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="text-2xl mb-2">🛠️</div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">Explore Tools</p>
                  <p className="text-sm text-gray-600">Try AI-powered features</p>
                </button>

                <button
                  onClick={() => navigate('/pricing')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="text-2xl mb-2">💎</div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600">Upgrade Plan</p>
                  <p className="text-sm text-gray-600">Unlock premium features</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
