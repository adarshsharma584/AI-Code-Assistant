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
    // Always try to fetch profile when component mounts
    myProfile();
  }, [myProfile]);

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
    if (!name) return 'U';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 4; // Total number of profile fields to complete
    
    if (profileData.fullName) completed++;
    if (profileData.bio && profileData.bio !== 'No bio added yet') completed++;
    if (profileData.email) completed++;
    if (user?.avatar) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Show loader for first 3 seconds
  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while profile data is being fetched
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-800 py-8 px-4 sm:px-6 lg:px-8 font-['Inter']">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 text-transparent bg-clip-text font-['Montserrat']">
              Profile Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Manage your account and preferences</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-400">
            <span>Last updated:</span>
            <span className="text-blue-400">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-500 to-cyan-500 p-0.5"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                  {getInitials(profileData.fullName || 'U')}
                </div>
              )}
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white">{profileData.fullName || 'User'}</h2>
                <p className="text-cyan-300">@{profileData.username || 'username'}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 text-xs font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/30">
                <div className="text-2xl font-bold text-blue-400">12</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Projects</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3 text-center border border-gray-600/30">
                <div className="text-2xl font-bold text-purple-400">48</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Commits</div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleEditToggle}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center"
            >
              {isEditing ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Edit
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Progress Status Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Profile Progress</h3>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Completion</span>
                <span className="text-blue-400 font-medium">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Progress Items */}
            <div className="space-y-3">
              {[
                { 
                  id: 1, 
                  label: 'Add your full name', 
                  completed: !!profileData.fullName,
                  action: () => !profileData.fullName && handleEditToggle()
                },
                { 
                  id: 2, 
                  label: 'Complete your bio', 
                  completed: profileData.bio && profileData.bio !== 'No bio added yet',
                  action: () => !profileData.bio && handleEditToggle()
                },
                { 
                  id: 3, 
                  label: 'Add profile picture', 
                  completed: !!user?.avatar,
                  action: () => {}
                },
                { 
                  id: 4, 
                  label: 'Verify your email', 
                  completed: !!profileData.email,
                  action: () => {}
                }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={item.action}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${item.completed ? 'bg-green-500/10' : 'bg-gray-700/30 hover:bg-gray-600/50'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${item.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/50 text-gray-500'}`}>
                      {item.completed ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${item.completed ? 'text-gray-300' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </div>
                  {!item.completed && item.action && (
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* About Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">About Me</h2>
            </div>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none transition-all duration-300"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                    <p className="text-white font-medium">{profileData.fullName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Username</p>
                    <p className="text-white font-medium">@{profileData.username || 'username'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-white font-medium">{profileData.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Member Since</p>
                    <p className="text-white font-medium">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Bio</p>
                  <p className="text-gray-300 leading-relaxed bg-gray-700/30 rounded-xl p-4">
                    {profileData.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                  </p>
                </div>
              </div>
            )}

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

            {/* Activity Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 1, text: 'You updated your profile information', time: '2 hours ago', icon: '📝' },
                { id: 2, text: 'Completed project setup for AI Assistant', time: '1 day ago', icon: '✅' },
                { id: 3, text: 'Connected GitHub repository', time: '3 days ago', icon: '🔗' },
                { id: 4, text: 'Joined the platform', time: '1 week ago', icon: '🎉' },
              ].map((activity) => (
                <div key={activity.id} className="flex items-start p-3 rounded-xl bg-gray-700/30 hover:bg-gray-600/50 transition-colors duration-200">
                  <div className="text-2xl mr-3 mt-0.5">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.text}</p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Profile;