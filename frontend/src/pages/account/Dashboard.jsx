import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Tag, ShieldCheck, ChevronRight, Activity, Clock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import SectionHeader from '../../components/ui/SectionHeader';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Calculate profile completion
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'];
  const completedFields = requiredFields.filter(field => user?.[field]).length;
  const profileCompletion = Math.round((completedFields / requiredFields.length) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hello, {user?.firstName} 👋</h1>
            <p className="text-primary-100">Welcome back to your personalized NextCart AI dashboard.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-bold">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            {profileCompletion < 100 && (
              <Link to="/account/profile" className="text-xs text-white underline mt-2 block">
                Complete profile for rewards
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/account/orders">
          <StatCard title="Recent Orders" value="0" icon={Package} className="hover:border-primary-500 transition-colors" />
        </Link>
        <Link to="/account/wishlist">
          <StatCard title="Wishlist Items" value={user?.wishlist?.length || '0'} icon={Heart} className="hover:border-primary-500 transition-colors" />
        </Link>
        <Link to="/account/addresses">
          <StatCard title="Saved Addresses" value={user?.addresses?.length || '0'} icon={MapPin} className="hover:border-primary-500 transition-colors" />
        </Link>
        <Link to="/account">
          <StatCard title="Available Coupons" value="2" icon={Tag} className="hover:border-primary-500 transition-colors" />
        </Link>
      </div>

      {/* Two Column Layout for complex stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <SectionHeader title="Quick Actions" className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/account/profile" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <div className="p-3 bg-white dark:bg-gray-700 shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform text-primary-600">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Edit Profile</span>
              </Link>
              <Link to="/account/security" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <div className="p-3 bg-white dark:bg-gray-700 shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Security</span>
              </Link>
              <Link to="/account/orders" className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <div className="p-3 bg-white dark:bg-gray-700 shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform text-green-600">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Track Order</span>
              </Link>
              <Link to="/ai-shopping" className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors group">
                <div className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform text-purple-600">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Stylist</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <SectionHeader 
              title="Recent Orders" 
              action={
                <Link to="/account/orders" className="text-sm text-primary-600 font-medium flex items-center hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              }
            />
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No recent orders found</p>
              <Link to="/products" className="text-primary-600 text-sm hover:underline mt-1 inline-block">Start Shopping</Link>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Recommendations */}
        <div className="space-y-8">
          {/* Security Status */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Verified</span>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">Yes</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">2FA Enabled</span>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full font-medium">No</span>
              </div>
              <Link to="/account/security" className="block text-center text-sm text-primary-600 hover:underline pt-2">
                Manage Security Settings
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
