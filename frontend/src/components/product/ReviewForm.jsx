import { useState, useCallback } from 'react';
import { Star, UploadCloud, X } from 'lucide-react';
import Button from '../ui/Button';

const ReviewForm = ({ onSubmit, isSubmitting, initialData = null, onCancel }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [images, setImages] = useState([]); // File objects
  const [previewUrls, setPreviewUrls] = useState(initialData?.images?.map(img => img.url) || []);
  
  const MAX_CHARS = 1000;
  const MAX_IMAGES = 5;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addFiles(files);
  }, [images, previewUrls]);

  const addFiles = (files) => {
    if (images.length + previewUrls.length + files.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }
    setImages(prev => [...prev, ...files]);
    
    // Generate previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrls(prev => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    // It gets tricky mapping existing URLs vs new files, 
    // for simplicity we reset the File objects if they remove something 
    // to force re-selecting if they mess up, or we can just filter carefully.
    // Assuming new files are appended to the end of previewUrls
    const existingCount = initialData?.images?.length || 0;
    if (index >= existingCount) {
      setImages(prev => prev.filter((_, i) => i !== (index - existingCount)));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('title', title);
    formData.append('comment', comment);
    
    images.forEach(img => {
      formData.append('images', img);
    });

    // If updating, send existing images data so backend knows what to keep
    if (initialData && initialData.images) {
      // Find which initial images are still in previewUrls
      const retainedImages = initialData.images.filter(img => previewUrls.includes(img.url));
      formData.append('existingImages', JSON.stringify(retainedImages));
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-lg mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {initialData ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Rating *</label>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => setRating(star)}
            >
              <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add a Headline *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's most important to know?"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          maxLength={100}
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add a Written Review *</label>
          <span className={`text-xs ${comment.length > MAX_CHARS - 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {comment.length} / {MAX_CHARS}
          </span>
        </div>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike? What did you use this product for?"
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
          maxLength={MAX_CHARS}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Photos (Optional, max 5)</label>
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop images here or click to browse</p>
            <input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
              id="review-images"
              onChange={handleImageChange}
            />
            <label htmlFor="review-images" className="cursor-pointer bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2">
              Browse Files
            </label>
          </div>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
