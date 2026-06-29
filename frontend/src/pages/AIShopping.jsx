import { useState } from 'react';
import { Sparkles, Send, Search } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const AIShopping = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fake product recommendations for the mockup
  const fakeRecommendations = [
    {
      _id: 'mock1',
      name: 'ASUS ROG Strix G15 (2026) Gaming Laptop',
      price: 79999,
      rating: 4.8,
      reviews: 124,
      image: 'https://placehold.co/400x400/2a2a2a/ffffff?text=Gaming+Laptop',
      stock: 15,
      category: 'Electronics'
    },
    {
      _id: 'mock2',
      name: 'Lenovo Legion 5 Pro RTX 4060',
      price: 85500,
      rating: 4.7,
      reviews: 89,
      image: 'https://placehold.co/400x400/2a2a2a/ffffff?text=Legion+5',
      stock: 8,
      category: 'Electronics'
    },
    {
      _id: 'mock3',
      name: 'HP OMEN 16 Advanced Gaming',
      price: 76000,
      rating: 4.5,
      reviews: 210,
      image: 'https://placehold.co/400x400/2a2a2a/ffffff?text=HP+OMEN',
      stock: 22,
      category: 'Electronics'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(false);

    // Simulate AI thinking delay
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
            <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            AI Shopping Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Describe what you're looking for, and our AI will find the perfect products for you.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 mb-12 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-6 h-6 text-gray-400 ml-4 hidden sm:block" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I'm looking for a gaming laptop under ₹80,000..."
              className="w-full px-4 sm:px-6 py-4 bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-2 shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Thinking...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Generate Recommendations</span>
                  <Send className="w-4 h-4 sm:hidden" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {showResults && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 mb-8 border border-purple-100 dark:border-purple-800/30">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Here's what I found for you</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Based on your request for a gaming laptop under ₹80,000, I've selected these top performers that balance CPU power and dedicated graphics within your budget constraints.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fakeRecommendations.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIShopping;
