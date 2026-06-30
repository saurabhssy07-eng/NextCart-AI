import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16 transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">NextCart AI</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your AI-powered e-commerce platform for the best online shopping experience.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex gap-4">
                <a href="https://github.com/saurabhssy07-eng" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/saurabh-singh-yadav-b23252361" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
              <a href="mailto:saurabhssy07@gmail.com" className="text-gray-400 hover:text-white text-xs transition-colors">saurabhssy07@gmail.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/orders" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/ai-shopping" className="hover:text-primary-400 transition-colors flex items-center gap-2">AI Shopping ✨</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Daily Deals</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>&copy; 2026 NextCart AI. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">🇮🇳 Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;