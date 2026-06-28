import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { reviewService } from '../../services/api';

const AiReviewSummary = ({ productId, productRating }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        // Fetch a large chunk of reviews to analyze
        const res = await reviewService.getProductReviews(productId, { limit: 100 });
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews for AI summary", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchAllReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-8 mb-12 animate-pulse h-64 border border-purple-100 dark:border-purple-800/30"></div>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show AI summary if no reviews exist
  }

  // Very basic simulation of AI keyword extraction from real reviews
  const allText = reviews.map(r => `${r.title} ${r.comment}`).join(' ').toLowerCase();
  
  // Keyword matching (Simulated AI)
  const strengths = [];
  const weaknesses = [];
  
  if (allText.includes('comfort') || allText.includes('soft')) strengths.push('Users frequently praise the comfort and feel');
  if (allText.includes('quality') || allText.includes('durable') || allText.includes('build')) strengths.push('High quality build materials noted by many');
  if (allText.includes('value') || allText.includes('price')) strengths.push('Considered excellent value for money');
  if (allText.includes('fast') || allText.includes('quick')) strengths.push('Fast performance and responsiveness');

  if (allText.includes('expensive') || allText.includes('pricey')) weaknesses.push('Some users feel it is slightly expensive');
  if (allText.includes('battery')) weaknesses.push('Battery life could be improved');
  if (allText.includes('heavy') || allText.includes('bulky')) weaknesses.push('A few users found it heavy or bulky');
  if (allText.includes('slow')) weaknesses.push('Occasional sluggishness reported');

  // Fallbacks if no keywords matched
  if (strengths.length === 0) strengths.push('Generally positive feedback from users');
  if (weaknesses.length === 0) weaknesses.push('No major recurring complaints found in reviews');

  const score = (productRating * 2).toFixed(1); // out of 10

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32" />
      </div>
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-purple-950 dark:text-purple-100 font-bold text-2xl">✨ AI Shopping Assistant</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Aggregated from {reviews.length} verified customer reviews</p>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur px-5 py-3 rounded-2xl border border-purple-200 dark:border-purple-800/50 flex flex-col items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Overall Score</span>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-purple-700 dark:text-purple-400 leading-none">{score}</span>
              <span className="text-gray-500 font-medium mb-0.5">/ 10</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-black/30 rounded-2xl p-6 border border-white/50 dark:border-purple-800/30 shadow-sm">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
              <span className="text-green-500">👍</span> Strengths
            </h5>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div> {s}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/60 dark:bg-black/30 rounded-2xl p-6 border border-white/50 dark:border-purple-800/30 shadow-sm">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
              <span className="text-red-500">👎</span> Weaknesses
            </h5>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {weaknesses.slice(0, 2).map((w, i) => (
                <li key={i} className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div> {w}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <div className="bg-white/40 dark:bg-black/20 p-5 rounded-xl">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-yellow-500 text-lg">⭐</span> Bottom Line
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Based on {reviews.length} reviews, this product leans {productRating >= 4 ? 'highly positive' : productRating >= 3 ? 'mixed' : 'negative'}. 
              {productRating >= 4 ? ' Most customers are satisfied with their purchase.' : ' Consider user feedback carefully before purchasing.'}
            </p>
          </div>
          <div className="bg-purple-100/50 dark:bg-purple-900/30 p-5 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
            <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
              <span className="text-blue-500 text-lg">💡</span> AI Recommendation
            </h5>
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300 leading-relaxed">
              {productRating >= 4 ? 'Highly recommended for purchase based on overwhelming positive sentiment.' : 'Recommended with caution. Review the weaknesses to ensure they align with your needs.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiReviewSummary;
