import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
import { reviewService } from '../../services/api';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import CustomerPhotos from './CustomerPhotos';
import Button from '../ui/Button';

const ReviewSection = ({ product }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  
  // Filters & Sorting
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('');
  
  // State for Write Review form
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userExistingReview, setUserExistingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [product._id, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(product._id, {
        sort: sortBy,
        rating: filterRating,
        limit: 50 // Simplified pagination for now
      });
      setReviews(data.data);
      setTotalReviews(data.total);
      
      // Check if current user has already reviewed
      if (user) {
        const existing = data.data.find(r => r.user?._id === user._id);
        if (existing) {
          setUserExistingReview(existing);
        }
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateReview = async (formData) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (userExistingReview) {
        await reviewService.updateReview(userExistingReview._id, formData);
        toast.success('Review updated successfully!');
      } else {
        await reviewService.createReview(product._id, formData);
        toast.success('Review submitted successfully!');
      }
      setShowForm(false);
      fetchReviews(); // Reload list
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reviewId, value) => {
    if (!isAuthenticated) {
      toast.info('Please login to vote');
      return;
    }
    try {
      await reviewService.voteReview(reviewId, value);
      // Optimistically fetch reviews again or update state
      fetchReviews(); 
    } catch (error) {
      toast.error(error.message || 'Failed to register vote');
    }
  };

  // Safe defaults for distribution
  const distribution = product.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalDistCount = Object.values(distribution).reduce((a, b) => a + b, 0) || 1; // avoid divide by zero

  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800" id="reviews">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Stats & Summary */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {product.rating?.toFixed(1) || '0.0'}
            </div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.reviews || 0} global ratings</p>
            </div>
          </div>

          {!showForm && (
            <div className="mb-6">
              <Button onClick={() => setShowForm(true)} className="w-full">
                {userExistingReview ? 'Edit Your Review' : 'Write a Review'}
              </Button>
            </div>
          )}

          {/* Distribution Bars */}
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribution[star] || 0;
              const percentage = Math.round((count / totalDistCount) * 100);
              return (
                <div key={star} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilterRating(filterRating === star.toString() ? '' : star.toString())}>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 hover:underline group-hover:text-primary-600">{star} star</div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{percentage}%</div>
                </div>
              );
            })}
          </div>

          {/* Customer Photos moved to left column */}
          <div className="mb-6">
            <CustomerPhotos reviews={reviews} />
          </div>
        </div>

        {/* Right Column: Review List & Form */}
        <div className="lg:w-2/3">
          {showForm ? (
            <ReviewForm 
              initialData={userExistingReview} 
              onSubmit={handleCreateOrUpdateReview} 
              isSubmitting={isSubmitting} 
              onCancel={() => setShowForm(false)} 
            />
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800 gap-4">
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {filterRating ? `Showing ${filterRating}-star reviews` : `Showing all ${totalReviews} reviews`}
                  {filterRating && (
                    <button onClick={() => setFilterRating('')} className="ml-2 text-sm text-primary-600 hover:underline">Clear Filter</button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="verified">Verified Purchases</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <ReviewCard key={review._id} review={review} onVote={handleVote} currentUserId={user?._id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No reviews found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
