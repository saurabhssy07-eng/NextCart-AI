import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Key, Smartphone, Mail, Globe, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';

const Security = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // 2FA State
  const [qrCode, setQrCode] = useState(null);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  
  const handleLogoutAll = async () => {
    try {
      await authService.logoutAll();
      toast.success('Logged out of all devices successfully.');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout of all devices');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const res = await authService.generate2FA();
      if (res.success) {
        setQrCode(res.qrCodeUrl);
        setShow2FAModal(true);
      }
    } catch (error) {
      toast.error('Error generating 2FA');
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setIsVerifying2FA(true);
    try {
      const res = await authService.verify2FA(twoFactorToken);
      if (res.success) {
        toast.success('Two-Factor Authentication enabled!');
        setShow2FAModal(false);
        // Refresh page to get updated user object or dispatch updated user
        window.location.reload();
      } else {
        toast.error(res.message || 'Invalid code');
      }
    } catch (error) {
      toast.error('Invalid 2FA code');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await authService.disable2FA();
      if (res.success) {
        toast.success('Two-Factor Authentication disabled');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error disabling 2FA');
    }
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
                  {user?.twoFactorEnabled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">ENABLED</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>
            {user?.twoFactorEnabled ? (
              <button onClick={handleDisable2FA} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 rounded-lg">
                Disable
              </button>
            ) : (
              <button onClick={handleEnable2FA} className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg">
                Enable
              </button>
            )}
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

      {/* 2FA Modal */}
      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} title="Setup Two-Factor Authentication">
        <div className="p-4 space-y-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Scan this QR code with an authenticator app (e.g., Google Authenticator, Authy).
          </p>
          {qrCode && (
            <div className="flex justify-center bg-white p-2 rounded-lg inline-block mx-auto border dark:border-gray-700">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300 text-left mt-4">
            Enter the 6-digit code from your app to verify and enable 2FA:
          </p>
          <form onSubmit={handleVerify2FA} className="flex gap-2">
            <input
              type="text"
              required
              maxLength="6"
              placeholder="123456"
              value={twoFactorToken}
              onChange={(e) => setTwoFactorToken(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center tracking-widest text-lg font-mono"
            />
            <button
              type="submit"
              disabled={isVerifying2FA || twoFactorToken.length < 6}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Verify
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Security;
