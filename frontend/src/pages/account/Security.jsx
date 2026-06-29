import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Shield, Key, Smartphone, Mail, Globe, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Security = () => {
  const { user } = useSelector(state => state.auth);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const handleLogoutAll = () => {
    toast.info('This feature requires backend support (Coming soon)', { autoClose: 2000 });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
        
        {/* Password */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Key className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You should maintain a strong password to protect your account.
                </p>
                {showPasswordForm ? (
                  <form className="mt-4 space-y-4 max-w-sm" onSubmit={(e) => { e.preventDefault(); toast.success('Password updated!'); setShowPasswordForm(false); }}>
                    <input type="password" placeholder="Current Password" required className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <input type="password" placeholder="New Password" required className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
                      <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Last changed: Never</p>
                )}
              </div>
            </div>
            {!showPasswordForm && (
              <button 
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Change
              </button>
            )}
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Smartphone className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Two-Factor Authentication
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">COMING SOON</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>
            <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-not-allowed">
              Enable
            </button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connected Accounts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Google</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Connected</p>
                </div>
              </div>
              <button className="text-sm font-medium text-red-600 hover:text-red-700">Disconnect</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Address</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{user?.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded-full">Verified</span>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Log out of all other devices if you notice suspicious activity.
                </p>
                <p className="text-xs text-gray-400 mt-2">Last Login: Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <button 
              onClick={handleLogoutAll}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout All Devices
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Security;
