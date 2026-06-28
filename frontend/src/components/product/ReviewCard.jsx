import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, ShieldCheck, MoreVertical } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

const ReviewCard = ({ review, onVote, currentUserId }) => {
  const [showFullImage, setShowFullImage] = useState(null);

  // Calculate helpful votes
  const helpfulCount = review.votes?.filter(v => v.value === 'helpful').length || 0;
  const hasVotedHelpful = review.votes?.some(v => v.user === currentUserId && v.value === 'helpful');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={review.user?.avatar?.url} name={`${review.user?.firstName} ${review.user?.lastName}`} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.user?.firstName} {review.user?.lastName}
              </h4>
              {review.isVerifiedPurchase && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 py-0.5 px-1.5 flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              {review.editedAt && ' (Edited)'}
            </div>
          </div>
        </div>
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
          ))}
        </div>
      </div>

      <h5 className="font-bold text-gray-900 dark:text-white mb-2">{review.title}</h5>
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap text-sm leading-relaxed">
        {review.comment}
      </p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
          {review.images.map((img, idx) => (
            <div 
              key={idx} 
              className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowFullImage(img.url)}
            >
              <img src={img.url} alt={`Review ${idx}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
        <button 
          onClick={() => onVote(review._id, 'helpful')}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${hasVotedHelpful ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? 'fill-current' : ''}`} />
          {helpfulCount > 0 ? `${helpfulCount} Helpful` : 'Helpful'}
        </button>
      </div>

      {/* Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowFullImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <button className="absolute -top-10 right-0 text-white hover:text-gray-300 font-medium">Close</button>
            <img src={showFullImage} alt="Full screen review" className="max-w-full max-h-[80vh] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
