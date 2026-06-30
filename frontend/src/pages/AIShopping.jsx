import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Search, RefreshCw, ShoppingCart, Heart, BarChart2, ChevronRight, Eye, AlertCircle, Info, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { setCart } from '../store/cartSlice';
import { setUser } from '../store/authSlice';
import { toggleCompare } from '../store/compareSlice';
import { cartService, userService, aiService } from '../services/api';
import SEO from '../components/SEO';
import { useCurrency } from '../context/CurrencyContext';

const PIPELINE_STEPS = [
  { id: 0, text: '🔍 Understanding query intent...' },
  { id: 1, text: '📦 Querying database candidates...' },
  { id: 2, text: '🤖 Running relevance engines...' },
  { id: 3, text: '✨ Preparing personalized recommendations...' }
];

const INITIAL_SUGGESTIONS = [
  'Laptops under ₹80,000',
  'Best gaming phone under ₹30,000',
  'Running shoes with good comfort',
  'Professional office setup laptops',
  'Cheapest wireless earbuds'
];

const AIShopping = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const compareItems = useSelector((state) => state.compare?.items || []);
  const { formatPrice } = useCurrency();

  const [query, setQuery] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedBreakdowns, setExpandedBreakdowns] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const messagesEndRef = useRef(null);

  // Monitor page scroll to show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to the bottom of the chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  // Loading pipeline step simulation
  useEffect(() => {
    let interval;
    if (isSearching) {
      setActiveStep(0);
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < PIPELINE_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim() || isSearching) return;

    const userText = searchQuery.trim();
    setQuery('');
    setIsSearching(true);

    // Append user message immediately
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    try {
      const response = await aiService.recommend(userText, conversationId);
      if (response.success) {
        setConversationId(response.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: response.summary,
            payload: response
          }
        ]);
      } else {
        toast.error(response.message || 'Failed to retrieve recommendations');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Sorry, I encountered an issue while generating recommendations. Please try again.',
            error: true
          }
        ]);
      }
    } catch (err) {
      toast.error(err.message || 'Server connection error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network error: Unable to reach the AI engine. Please check your connection.',
          error: true
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await cartService.addToCart(productId, 1);
      if (res.success) {
        dispatch(setCart(res.data));
        toast.success('Added to cart successfully!');
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      toast.warning('Please log in to add items to your wishlist.');
      return;
    }
    try {
      const res = await userService.toggleWishlist(productId);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(res.message);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleToggleCompare = (product) => {
    dispatch(toggleCompare(product));
    const isCompared = compareItems.some((item) => item._id === product._id);
    if (isCompared) {
      toast.info('Removed from comparison list');
    } else {
      toast.success('Added to comparison list');
    }
  };

  const toggleBreakdown = (key) => {
    setExpandedBreakdowns((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearHistory = () => {
    setConversationId(null);
    setMessages([]);
    toast.info('Chat history cleared!');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const chatContainer = document.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col max-w-5xl relative">
      <SEO 
        title="AI Personal Shopping Assistant - NextCart" 
        description="Describe what you want, and let NextCart's hybrid AI matching search engine find it instantly." 
      />

      {/* Floating Go to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3.5 rounded-full shadow-xl transition-all duration-300 z-50 hover:scale-110 flex items-center justify-center border border-purple-500/20"
          title="Go to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Header Info */}
      <div className="text-center mb-8 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-100 dark:border-purple-900/30 mb-4 animate-pulse">
          <Sparkles className="w-4 h-4 fill-current animate-spin" style={{ animationDuration: '3s' }} />
          Powered by Gemini 1.5 & Hybrid Match Engine
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-normal py-2 mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
          NextCart AI Shopping Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Type your shopping queries naturally. Let AI do the hard search, filtering, and explanation logic for you.
        </p>
      </div>

      {/* Main Conversation Canvas */}
      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl flex flex-col overflow-hidden min-h-[450px]">
        
        {/* Messages list container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 animate-bounce">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Start your search</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Tell me what you are looking for, your budget constraints, or brands. E.g., "Gaming phone under 25k"
              </p>
              
              {/* Quick suggestions blocks */}
              <div className="w-full space-y-2">
                {INITIAL_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(item)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all flex items-center justify-between group"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-5 ${
                    isUser 
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : msg.error
                        ? 'bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-900 dark:text-red-300 rounded-tl-none'
                        : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Metadata Footer Badges */}
                    {!isUser && msg.payload && (
                      <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <span className={`px-2 py-0.5 rounded text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/30`}>
                          Confidence: {msg.payload.confidence}
                        </span>
                        <span>•</span>
                        <span>Provider: {msg.payload.provider}</span>
                        <span>•</span>
                        <span>Engine latency: {msg.payload.latency}ms</span>
                      </div>
                    )}

                    {/* AI Payload matches display if available */}
                    {!isUser && msg.payload && (
                      <div className="mt-6 space-y-6">

                        {/* Matches grid / mobile horizontal carousel */}
                        {msg.payload.matches && msg.payload.matches.length > 0 ? (
                          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                            {msg.payload.matches.map((item, mIdx) => {
                              const discPrice = item.product.discountPrice;
                              const price = item.product.price;
                              const isCompared = compareItems.some((c) => c._id === item.product._id);
                              const cardKey = `${index}_${mIdx}`;
                              const isExpanded = !!expandedBreakdowns[cardKey];
                              
                              return (
                                <div 
                                  key={mIdx} 
                                  className="w-[280px] md:w-auto shrink-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-[490px]"
                                >
                                  {/* Product image container */}
                                  <div className="h-40 bg-gray-50 dark:bg-gray-950 relative flex items-center justify-center p-4">
                                    
                                    {/* AI Match Badge */}
                                    <div className="absolute top-3 left-3 bg-purple-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                                      Match {item.matchScore}%
                                    </div>
                                    
                                    <img 
                                      src={item.product.image || item.product.images?.[0]?.url || 'https://placehold.co/400x400/2a2a2a/ffffff?text=Product'} 
                                      alt={item.product.name}
                                      className="h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform"
                                    />
                                  </div>

                                  {/* Details */}
                                  <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">
                                        {item.product.brand || 'Premium Brand'}
                                      </div>
                                      <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 min-h-[40px]">
                                        {item.product.name}
                                      </h4>

                                      {/* Price display */}
                                      <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                          {formatPrice(discPrice || price)}
                                        </span>
                                        {discPrice && discPrice < price && (
                                          <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(price)}
                                          </span>
                                        )}
                                      </div>

                                      {/* Expandable Match Score Breakdown Toggle */}
                                      <button 
                                        onClick={() => toggleBreakdown(cardKey)}
                                        className="w-full text-center text-[11px] font-bold text-purple-600 hover:text-purple-700 py-1.5 border border-purple-100 hover:bg-purple-50/50 dark:border-purple-950/30 dark:hover:bg-purple-950/20 rounded-xl transition mb-3 flex items-center justify-center gap-1"
                                      >
                                        <span>{isExpanded ? 'Hide Score Breakdown' : 'Show Score Breakdown'}</span>
                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>

                                      {isExpanded && (
                                        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-3 text-xs space-y-1 mb-4 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-1">
                                          <div className="font-bold text-[10px] uppercase tracking-wider text-gray-400 mb-1">Match Breakdown</div>
                                          <div className="flex justify-between">
                                            <span>Category Match</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.scoreBreakdown.category}%</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Keywords Match</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.scoreBreakdown.keyword}%</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Brand Match</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.scoreBreakdown.brand}%</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Budget Score</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.scoreBreakdown.budget}%</span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Reasons / Bullet Pros */}
                                      <div className="space-y-1 mb-4">
                                        {item.reasons.slice(0, 2).map((reason, rIdx) => (
                                          <div key={rIdx} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="text-green-500 font-bold">✓</span>
                                            <span>{reason}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                                      <button
                                        onClick={() => handleAddToCart(item.product._id)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                                      >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        Add to Cart
                                      </button>
                                      
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleToggleCompare(item.product)}
                                          title="Compare"
                                          className={`flex-1 flex items-center justify-center border rounded-xl py-2 transition ${
                                            isCompared 
                                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600'
                                              : 'border-gray-200 dark:border-gray-800 text-gray-600 hover:bg-gray-50'
                                          }`}
                                        >
                                          <BarChart2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleToggleWishlist(item.product._id)}
                                          title="Wishlist"
                                          className="flex-1 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-xl py-2 text-gray-600 hover:bg-gray-50"
                                        >
                                          <Heart className="w-3.5 h-3.5" />
                                        </button>
                                        <Link
                                          to={`/products/${item.product._id}`}
                                          title="Details"
                                          className="flex-1 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-xl py-2 text-gray-600 hover:bg-gray-50"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </Link>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Empty match state */
                          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4 mt-4">
                            <div className="flex gap-2.5 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                              <div>
                                <span className="font-bold">No exact matches found.</span> We couldn't find products that match your price boundaries perfectly. Try adjusting your parameters or checking the closest alternatives recommended below.
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Suggestion Chips */}
                        {msg.payload.suggestions && msg.payload.suggestions.length > 0 && (
                          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Info className="w-3.5 h-3.5 text-purple-500" />
                              Suggestions & Alternative options
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {msg.payload.suggestions.map((suggestion, sIdx) => {
                                const isActionable = suggestion.includes('View closest option:') || suggestion.includes('Explore') || suggestion.includes('budget');
                                const chipLabel = suggestion.replace('View closest option: ', '');
                                return (
                                  <button
                                    key={sIdx}
                                    onClick={() => handleSearch(chipLabel)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                      isActionable 
                                        ? 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-default'
                                    }`}
                                    disabled={!isActionable}
                                  >
                                    {chipLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Active loading state with animated progress pipeline */}
          {isSearching && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-none p-5 max-w-[80%] min-w-[280px]">
                <div className="space-y-3">
                  {PIPELINE_STEPS.map((step) => {
                    const isCompleted = step.id < activeStep;
                    const isActive = step.id === activeStep;
                    return (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center">
                          {isCompleted ? (
                            <span className="text-green-500 font-bold text-xs">✓</span>
                          ) : isActive ? (
                            <RefreshCw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <span className={`text-xs ${
                          isCompleted 
                            ? 'text-gray-400 line-through' 
                            : isActive 
                              ? 'text-purple-700 dark:text-purple-400 font-semibold' 
                              : 'text-gray-400'
                        }`}>
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Skeletons block */}
                <div className="mt-5 space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Search Input Box */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            {/* Clear History Button */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:border-red-200 hover:bg-red-50/20 shadow-sm transition-all"
                title="Clear Conversation History"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <form onSubmit={onSubmit} className="relative flex items-center flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Dell laptop with 16GB RAM under 75000..."
                disabled={isSearching}
                className="w-full pl-6 pr-16 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-[15px] shadow-sm transition-all"
              />
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute right-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition disabled:opacity-50 disabled:hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIShopping;
