import { useState } from 'react';

const CustomerPhotos = ({ reviews }) => {
  const [showFullImage, setShowFullImage] = useState(null);
  
  // Extract all images from all reviews
  const allImages = reviews.flatMap(review => review.images || []);

  if (allImages.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customer Photos</h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {allImages.slice(0, 8).map((img, idx) => (
          <div 
            key={idx} 
            className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowFullImage(img.url)}
          >
            <img src={img.url} alt={`Customer photo ${idx}`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
        {allImages.length > 8 && (
          <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">+{allImages.length - 8} More</span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setShowFullImage(null)}>
          <div className="relative max-w-5xl max-h-full">
            <button className="absolute -top-12 right-0 text-white hover:text-gray-300 font-medium bg-black/50 px-4 py-2 rounded-full">Close</button>
            <img src={showFullImage} alt="Full screen" className="max-w-full max-h-[85vh] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPhotos;
