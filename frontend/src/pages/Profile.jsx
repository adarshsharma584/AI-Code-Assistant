import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/contexts-Files/authContext';
import { Link } from 'react-router-dom';
import handyBot from "../assets/handy-resize.png"
function Profile() {
  const { user, token, loading, myProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: 'No bio added yet',
  });

  // Add initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      myProfile();
    }
  }, [token, myProfile]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || 'No bio added yet',
      });
    }
  }, [user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    // Add your save logic here
    setIsEditing(false);
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  // Show loader for first 3 seconds
  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthenticated state after loading
  if (!token || !user) {
    // Show loader for first 3 seconds even if unauthenticated
    if (pageLoading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400 animate-pulse">Loading...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-black py-12 px-4 font-['Poppins'] flex flex-col items-center justify-center relative">
        <img src={handyBot} alt="" className="h-30 w-auto absolute z-40 top-[50px]" />
        <div className="max-w-2xl mx-auto text-center bg-gray-900/50 p-12 backdrop-blur-sm  ">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-white text-transparent bg-clip-text mb-6 font-['Montserrat']">
            Authenticate First
          </h2>
          <p className="text-gray-300 mb-8">
            Please sign in or create an account to view your profile
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/sign-in"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-6 py-2 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 font-['Poppins'] bg-amber-200">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-white text-transparent bg-clip-text ml-4">
          Profile
        </h1>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 rounded-t-xl bg-gradient-to-r from-blue-900 to-gray-900 overflow-hidden">
            <div className="w-full h-full bg-black/30 backdrop-blur-sm"></div>
          </div>

          {/* Profile Picture & Basic Info */}
          <div className="absolute -bottom-[-30px] left-8 flex items-end gap-6">
            <div className="relative group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-black"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 flex items-center justify-center text-3xl font-bold text-white border-4 border-black">
                  {getInitials(profileData.fullName)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/50 rounded-xl p-8 pt-20 backdrop-blur-sm border border-white/10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2 font-['Montserrat']">
                {profileData.fullName}
              </h1>
              <p className="text-gray-400 text-lg">@{profileData.username}</p>
            </div>
            <button
              onClick={handleEditToggle}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Sections */}
          <div className="space-y-8">
            {/* Bio Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-['Montserrat']">About Me</h2>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full h-32 px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-['Montserrat']">Contact Information</h2>
              <div className="grid gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-gray-300">{profileData.email}</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;