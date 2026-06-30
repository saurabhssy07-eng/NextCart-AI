import React from 'react';
import { useLocation } from 'react-router-dom';
import { Info, HelpCircle, Shield, FileText, Phone, Users } from 'lucide-react';

const contentMap = {
  '/about': {
    title: 'About Us',
    icon: Users,
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>Welcome to NextCart AI, the premier destination for next-generation shopping experiences powered by artificial intelligence.</p>
        <p>Our mission is to revolutionize the e-commerce landscape by integrating state-of-the-art AI algorithms that learn your preferences and provide personalized recommendations.</p>
        <p>Founded in 2026, we've quickly grown to serve thousands of happy customers globally.</p>
      </div>
    )
  },
  '/contact': {
    title: 'Contact Us',
    icon: Phone,
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>We'd love to hear from you! Reach out to us for any inquiries, support, or partnership opportunities.</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Email (Gmail):</strong> <a href="mailto:saurabhssy07@gmail.com" className="text-blue-600 hover:underline">saurabhssy07@gmail.com</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/saurabhssy07" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">github.com/saurabhssy07</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/saurabhssy07" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/saurabhssy07</a></li>
        </ul>
      </div>
    )
  },
  '/privacy': {
    title: 'Privacy Policy',
    icon: Shield,
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-6">Data Collection</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.</p>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-6">Data Usage</h3>
        <p>The data we collect is used to provide, maintain, and improve our services, as well as to personalize your shopping experience through our AI models.</p>
      </div>
    )
  },
  '/terms': {
    title: 'Terms of Service',
    icon: FileText,
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>By using NextCart AI, you agree to these terms of service. Please read them carefully.</p>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-6">Account Responsibilities</h3>
        <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-6">Prohibited Activities</h3>
        <p>You may not use our service for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction.</p>
      </div>
    )
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    icon: HelpCircle,
    content: (
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">How does AI Shopping work?</h4>
          <p className="mt-1">Our AI analyzes your search queries and past purchases to recommend exactly what you're looking for.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">What is your return policy?</h4>
          <p className="mt-1">We offer a 30-day hassle-free return policy for most items in unused condition.</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">Do you ship internationally?</h4>
          <p className="mt-1">Yes, we ship to over 100 countries worldwide with real-time tracking.</p>
        </div>
      </div>
    )
  },
  '/support': {
    title: 'Customer Support',
    icon: Info,
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>Need help with your order or have a question about a product? Our support team is here for you 24/7.</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-6 border border-blue-100 dark:border-blue-800">
          <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Live Chat</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">Reach out to our support team for instant resolution.</p>
          <a href="mailto:saurabhssy07@gmail.com" className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">Email Us</a>
        </div>
      </div>
    )
  }
};

const StaticPage = () => {
  const location = useLocation();
  const pageData = contentMap[location.pathname] || {
    title: 'Information',
    icon: Info,
    content: <p>Information for this page is currently being updated.</p>
  };

  const Icon = pageData.icon;

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{pageData.title}</h1>
        </div>
        <div className="p-8">
          {pageData.content}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
