import React, { useState } from 'react';
import { User, Edit3, BookOpen, CreditCard, Shield, Bell, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { account, balance } = useWeb3();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: 'I am a student interested in learning mathematics and physics.',
    timezone: 'Pacific Time (PT)',
    phone: '+1 (555) 123-4567',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile in the database
    setIsEditing(false);
  };
  
  const truncateAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          View and edit your personal information
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-8 text-white">
              <div className="flex flex-col items-center">
                {currentUser?.profileImageUrl ? (
                  <img 
                    src={currentUser.profileImageUrl}
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border-4 border-white">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <h2 className="mt-4 text-xl font-semibold">{currentUser?.name}</h2>
                <p className="text-primary-100">{currentUser?.role === 'student' ? 'Student' : 'Tutor'}</p>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Personal Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'wallet'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    Wallet & Payments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('subjects')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'subjects'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Subjects & Preferences
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${
                      activeTab === 'security'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Security
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-outline py-2 flex items-center"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="timezone" className="label">Timezone</label>
                    <input
                      type="text"
                      id="timezone"
                      name="timezone"
                      value={profileData.timezone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="label">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input"
                  ></textarea>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
          
          {activeTab === 'wallet' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Wallet & Payments</h2>
              
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg p-6 text-white mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">EduMatch Tokens</h3>
                    <p className="text-primary-100">Your token balance</p>
                  </div>
                  <div className="text-3xl font-bold">{currentUser?.tokens}</div>
                </div>
                <div className="flex space-x-3">
                  <button className="btn bg-white text-primary-600 hover:bg-gray-100">
                    Buy Tokens
                  </button>
                  <button className="btn bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10">
                    Transfer
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Connected Wallet</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{truncateAddress(account)}</p>
                      <p className="text-sm text-gray-600">
                        Balance: {balance ? parseFloat(balance).toFixed(4) : '0'} ETH
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-outline">Disconnect</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Methods</h3>
                <button className="btn btn-outline w-full flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'subjects' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects & Preferences</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Interested Subjects</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    Mathematics
                    <button className="ml-1 text-primary-600 hover:text-primary-800">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    Physics
                    <button className="ml-1 text-primary-600 hover:text-primary-800">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button className="btn btn-outline">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Subject
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Learning Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked />
                      <span className="ml-2 text-gray-700">One-on-one sessions</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <span className="ml-2 text-gray-700">Group sessions</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked />
                      <span className="ml-2 text-gray-700">Visual learning style</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked />
                      <span className="ml-2 text-gray-700">Interactive exercises</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Availability</h3>
                <p className="text-gray-600 mb-4">Set your preferred available times for tutoring sessions</p>
                <button className="btn btn-primary">
                  Update Availability
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Session reminders</p>
                        <p className="text-sm text-gray-500">Receive email reminders before scheduled sessions</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200">
                        <input type="checkbox" name="session-reminder" id="session-reminder" className="sr-only" defaultChecked />
                        <label htmlFor="session-reminder" className="block h-6 w-12 bg-gray-300 rounded-full cursor-pointer after:content-[''] after:block after:absolute after:h-5 after:w-5 after:rounded-full after:top-0.5 after:left-0.5 after:bg-white after:transition-transform after:duration-200 checked:bg-primary-600 checked:after:translate-x-6"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New messages</p>
                        <p className="text-sm text-gray-500">Receive email notifications for new messages</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200">
                        <input type="checkbox" name="new-message" id="new-message" className="sr-only" />
                        <label htmlFor="new-message" className="block h-6 w-12 bg-gray-300 rounded-full cursor-pointer after:content-[''] after:block after:absolute after:h-5 after:w-5 after:rounded-full after:top-0.5 after:left-0.5 after:bg-white after:transition-transform after:duration-200 checked:bg-primary-600 checked:after:translate-x-6"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Marketing emails</p>
                        <p className="text-sm text-gray-500">Receive emails about new features and special offers</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200">
                        <input type="checkbox" name="marketing" id="marketing" className="sr-only" defaultChecked />
                        <label htmlFor="marketing" className="block h-6 w-12 bg-gray-300 rounded-full cursor-pointer after:content-[''] after:block after:absolute after:h-5 after:w-5 after:rounded-full after:top-0.5 after:left-0.5 after:bg-white after:transition-transform after:duration-200 checked:bg-primary-600 checked:after:translate-x-6"></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Session reminders</p>
                        <p className="text-sm text-gray-500">Receive push notifications before scheduled sessions</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200">
                        <input type="checkbox" name="push-session" id="push-session" className="sr-only" defaultChecked />
                        <label htmlFor="push-session" className="block h-6 w-12 bg-gray-300 rounded-full cursor-pointer after:content-[''] after:block after:absolute after:h-5 after:w-5 after:rounded-full after:top-0.5 after:left-0.5 after:bg-white after:transition-transform after:duration-200 checked:bg-primary-600 checked:after:translate-x-6"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New messages</p>
                        <p className="text-sm text-gray-500">Receive push notifications for new messages</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200">
                        <input type="checkbox" name="push-message" id="push-message" className="sr-only" defaultChecked />
                        <label htmlFor="push-message" className="block h-6 w-12 bg-gray-300 rounded-full cursor-pointer after:content-[''] after:block after:absolute after:h-5 after:w-5 after:rounded-full after:top-0.5 after:left-0.5 after:bg-white after:transition-transform after:duration-200 checked:bg-primary-600 checked:after:translate-x-6"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Change Password</h3>
                <form>
                  <div className="mb-4">
                    <label htmlFor="current-password" className="label">Current Password</label>
                    <input type="password" id="current-password" className="input" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="new-password" className="label">New Password</label>
                    <input type="password" id="new-password" className="input" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirm-password" className="label">Confirm New Password</label>
                    <input type="password" id="confirm-password" className="input" />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                <button className="btn btn-outline">
                  Enable Two-Factor Authentication
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sessions</h3>
                <p className="text-gray-600 mb-4">Manage your active sessions and sign out from other devices</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Current Session</p>
                      <p className="text-sm text-gray-600">Windows - Chrome - New York, USA</p>
                      <p className="text-xs text-gray-500">Started: Today at 10:23 AM</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50">
                  Sign Out All Other Devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;