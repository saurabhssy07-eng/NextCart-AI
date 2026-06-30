import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, Heart, Bell, User, Menu, X, 
  Sparkles, Package, Tag, LogOut, Code, Mail, ExternalLink, Terminal 
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
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);
  const searchInputRef = useRef(null);

  const cartItemsCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsDevDrawerOpen(false);
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
            
            {/* Developer Connect Hamburger Icon */}
            <button 
              onClick={() => setIsDevDrawerOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              title="Connect with Developer"
            >
              <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold hidden md:inline pr-1">Dev Connect</span>
            </button>

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
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDevDrawerOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-left w-full"
                >
                  <Code className="w-5 h-5 text-purple-500" /> Meet Developer 🚀
                </button>
                
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

      {/* Developer Connect Right Slide-Over Drawer */}
      <AnimatePresence>
        {isDevDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDevDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Meet the Developer</span>
                </div>
                <button 
                  onClick={() => setIsDevDrawerOpen(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Developer Profile card */}
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <img 
                    src="https://avatars.githubusercontent.com/u/221521607?v=4" 
                    alt="Saurabh Singh Yadav"
                    className="w-24 h-24 rounded-full border-4 border-purple-500/20 shadow-md mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">SAURABH SINGH YADAV</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-2 uppercase tracking-wider">Computer Science Engineer</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    Computer Science student (B.Tech) at Saraswati Higher Education and Technical College of Engineering.
                  </p>
                </div>

                {/* Social Connect Options */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Connect with Me</h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    
                    <a 
                      href="https://github.com/saurabhssy07-eng" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-purple-50/30 dark:hover:bg-purple-950/10 hover:border-purple-200 transition-all group"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-950/50 group-hover:text-purple-600 transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">GitHub Profile</div>
                        <div className="text-xs text-gray-400">saurabhssy07-eng</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                    </a>

                    <a 
                      href="https://www.linkedin.com/in/saurabh-singh-yadav-b23252361" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-purple-50/30 dark:hover:bg-purple-950/10 hover:border-purple-200 transition-all group"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-950/50 group-hover:text-purple-600 transition-colors flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">LinkedIn Connection</div>
                        <div className="text-xs text-gray-400">in/saurabh-singh-yadav-b23252361</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                    </a>

                    <a 
                      href="mailto:saurabhssy07@gmail.com" 
                      className="flex items-center gap-3 p-3.5 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-purple-50/30 dark:hover:bg-purple-950/10 hover:border-purple-200 transition-all group"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-950/50 group-hover:text-purple-600 transition-colors flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Direct Email</div>
                        <div className="text-xs text-gray-400">saurabhssy07@gmail.com</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                    </a>

                  </div>
                </div>

                {/* Projects Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Other Public Projects</h4>
                  <div className="space-y-3">
                    
                    {/* CarbonWise AI */}
                    <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">CarbonWise AI</span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        CarbonWise AI - Personal carbon footprint tracker powered by React, Firebase and Gemini AI.
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href="https://github.com/saurabhssy07-eng/CarbonWiseAI" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                          Code
                        </a>
                        <a 
                          href="https://carbon-wise-ai-liard.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      </div>
                    </div>

                    {/* AuraResume */}
                    <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">AuraResume</span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        Modern ATS-Friendly Resume Builder with Cloud PDF Export powered by Next.js & Puppeteer.
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href="https://github.com/saurabhssy07-eng/AuraResume" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                          Code
                        </a>
                        <a 
                          href="https://auraresume-p31i.onrender.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      </div>
                    </div>

                    {/* News Detection App */}
                    <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">News Detection App</span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded">Active</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        AI-based fake news detection web application using machine learning models.
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href="https://github.com/saurabhssy07-eng/News_Detection_App" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                          Code
                        </a>
                        <a 
                          href="https://news-detection-app-gsan.onrender.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
