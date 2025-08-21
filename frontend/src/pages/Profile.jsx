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
    }, 500);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-8 px-4 font-['Inter']">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text font-['Montserrat']">
              Profile Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage your account and preferences</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            <span>Last updated:</span>
            <span className="text-blue-400">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white/20">
                    {getInitials(profileData.fullName)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-1 font-['Montserrat']">
                {profileData.fullName}
              </h2>
              <p className="text-blue-400 font-medium">@{profileData.username}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Active</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-blue-400">12</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Projects</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-purple-400">48</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Commits</div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleEditToggle}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              {isEditing ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Edit
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative -mt-20">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-gray-800">
                      {getInitials(profileData.fullName)}
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white">{profileData.fullName}</h2>
                  <p className="text-gray-400">@{profileData.username}</p>
                  <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                      Active
                    </span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                      Pro Member
                    </span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">About Me</h3>
                </div>
                
                {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full h-40 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none transition-all duration-300"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {profileData.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                </p>
              )}
              
              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Contact</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">{profileData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Profile Progress</h2>
              </div>
              
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Profile Completion</span>
                    <span className="text-blue-400 font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
                
                {/* Progress Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${profileData.fullName ? 'bg-green-500/10 text-green-400' : 'bg-gray-600/30 text-gray-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={profileData.fullName ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <span className={profileData.fullName ? 'text-white' : 'text-gray-400'}>Add your full name</span>
                    </div>
                    {!profileData.fullName && (
                      <button 
                        onClick={handleEditToggle}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${profileData.bio ? 'bg-green-500/10 text-green-400' : 'bg-gray-600/30 text-gray-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={profileData.bio ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <span className={profileData.bio ? 'text-white' : 'text-gray-400'}>Complete your bio</span>
                    </div>
                    {!profileData.bio && (
                      <button 
                        onClick={handleEditToggle}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-gray-600/30 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-400">Upload a profile picture</span>
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 h-fit sticky top-6">
                <h3 className="text-xl font-semibold text-white mb-6">Edit Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <button
                    onClick={handleSave}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-medium transition-colors mt-4"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="text-green-400 font-medium">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 h-fit">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white font-['Montserrat']">Edit Profile</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </span>
                </button>
              </div>
            </div>
          )}
    </div>
   
   
   
  );
}

export default Profile;