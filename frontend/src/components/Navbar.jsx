import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, Heart, Bell, User, Menu, X, 
  Sparkles, Package, Tag, LogOut 
} from 'lucide-react';
import { logout } from '../store/authSlice';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);

  const cartItemsCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = isAuthenticated ? [
    { name: 'Search', path: '/products', icon: Search },
    { name: 'Categories', path: '/categories', icon: Package },
    { name: 'Deals', path: '/deals', icon: Tag },
    { name: 'AI Shopping', path: '/ai-shopping', icon: Sparkles },
    { name: 'Wishlist', path: '/account/wishlist', icon: Heart },
    { name: 'Orders', path: '/account/orders', icon: Package },
  ] : [
    { name: 'Categories', path: '/categories', icon: Package },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Deals', path: '/deals', icon: Tag },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-block text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                NextCart AI
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-primary-500 rounded-xl outline-none transition-all text-sm text-gray-900 dark:text-gray-100"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex gap-1">
                <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400">Ctrl K</kbd>
              </div>
            </form>
          </div>

          {/* Desktop Links (Center-ish) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`transition-colors flex items-center gap-1.5 ${link.name === 'AI Shopping' ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full' : 'hover:text-primary-600'}`}>
                {link.name === 'AI Shopping' && <Sparkles className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Mobile Search Toggle could go here if we expand */}
            
            {isAuthenticated ? (
              <>
                <Link to="/account/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Link>

                <Link to="/account/notifications" className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                  <Bell className="w-5 h-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-1 border border-border-light dark:border-border-dark rounded-full hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block ml-1">
                      {user?.firstName}
                    </span>
                    <Avatar src={user?.avatar?.url} name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-border-light dark:border-border-dark mb-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                        <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Package className="w-4 h-4" /> Orders
                        </Link>
                        <Link to="/account/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 sm:hidden">
                          <Heart className="w-4 h-4" /> Wishlist
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20 text-left mt-1 border-t border-border-light dark:border-border-dark pt-2"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors bg-gray-50 dark:bg-gray-800">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-gray-900">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white border focus:border-primary-500 rounded-lg outline-none text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  NextCart AI
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
                <Link to="/ai-shopping" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium mb-2">
                  <Sparkles className="w-5 h-5" /> AI Assistant ✨
                </Link>
                
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
                    <link.icon className="w-5 h-5 text-gray-400" /> {link.name}
                  </Link>
                ))}

                {!isAuthenticated && (
                  <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex flex-col gap-3">
                    <Link to="/login" className="w-full py-2.5 text-center font-medium border border-border-light rounded-lg">Login</Link>
                    <Link to="/register" className="w-full py-2.5 text-center font-medium bg-primary-600 text-white rounded-lg">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
