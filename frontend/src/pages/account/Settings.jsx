import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Monitor, Globe, IndianRupee, Mail, Bell, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    currency: 'INR',
    language: 'EN',
    orderEmails: true,
    promoEmails: false,
    smsAlerts: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Settings updated successfully', { autoClose: 1000 });
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Settings updated successfully', { autoClose: 1000 });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
        
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-500" />
            Appearance
          </h3>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose how NextCart looks to you.</p>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-md flex items-center justify-center transition-all ${theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-md flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-gray-800 shadow-sm text-blue-400' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Region */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Regional Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Language</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your preferred language.</p>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="EN">English</option>
                <option value="HI">Hindi</option>
                <option value="ES">Spanish</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Currency</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Display prices in your local currency.</p>
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => handleSelect('currency', e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Emails about your order status.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.orderEmails} onChange={() => handleToggle('orderEmails')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Marketing & Promos</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive offers and newsletters.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.promoEmails} onChange={() => handleToggle('promoEmails')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get text messages for delivery updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.smsAlerts} onChange={() => handleToggle('smsAlerts')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
