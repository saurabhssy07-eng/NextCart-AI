import { Review, Product, Order } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper function to check if a user actually purchased the product.
const hasPurchasedProduct = async (userId, productId) => {
  const count = await Order.countDocuments({
    user: userId,
    'items.product': productId,
    orderStatus: 'delivered'
  });
  return count > 0;
};

// Upload multiple images to Cloudinary (Max 5, limited in routes)
const uploadReviewImagesToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/reviews` : 'nextcart/reviews',
          transformation: [
            { width: 800, crop: 'limit' },
            { fetch_format: 'auto', quality: 'auto' }
          ],
        },
        (error, result) => {
          if (result) resolve({ publicId: result.public_id, url: result.secure_url });
          else reject(error);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });

  return Promise.all(uploadPromises);
};

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Check verified purchase
    const isVerifiedPurchase = await hasPurchasedProduct(userId, productId);

    if (!isVerifiedPurchase) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only review products you have purchased and received.' 
      });
    }

    // Upload images if any
    let images = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ success: false, message: 'Maximum 5 images allowed per review' });
      }
      images = await uploadReviewImagesToCloudinary(req.files);
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating: Number(rating),
      title,
      comment,
      images,
      isVerifiedPurchase
    });

    // Populate user info for immediate display
    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};

// @desc    Get all reviews for a product with pagination, sorting, and filtering
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build Query
    const query = { product: productId, status: 'approved' };

    // Filtering by rating
    if (req.query.rating) {
      query.rating = Number(req.query.rating);
    }
    
    // Filtering by with images
    if (req.query.withImages === 'true') {
      query['images.0'] = { $exists: true };
    }

    // Sorting
    let sortObj = { createdAt: -1 }; // Default Newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'highest': sortObj = { rating: -1, createdAt: -1 }; break;
        case 'lowest': sortObj = { rating: 1, createdAt: -1 }; break;
        case 'helpful': sortObj = { 'votes.length': -1, createdAt: -1 }; break;
        case 'verified': query.isVerifiedPurchase = true; break;
        default: break; // 'newest'
      }
    }

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName avatar')
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, title, comment, existingImages } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure user owns review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this review' });
    }

    // Process retained images (images user decided to keep)
    // Parse existingImages if it's sent as a stringified JSON array
    let parsedExistingImages = [];
    if (existingImages) {
      parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
    }
    
    // Find images to delete from Cloudinary
    const imagesToDelete = review.images.filter(img => 
      !parsedExistingImages.some(retained => retained.publicId === img.publicId)
    );

    // Delete removed images from Cloudinary
    for (const img of imagesToDelete) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(err => console.log('Cloudinary delete error:', err));
      }
    }

    // Upload new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      if (parsedExistingImages.length + req.files.length > 5) {
        return res.status(400).json({ success: false, message: 'Maximum 5 images allowed per review in total' });
      }
      newImages = await uploadReviewImagesToCloudinary(req.files);
    }

    review.rating = Number(rating) || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = [...parsedExistingImages, ...newImages];
    review.editedAt = Date.now();

    await review.save();

    await review.populate('user', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure user owns review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
      for (const img of review.images) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId).catch(err => console.log('Cloudinary delete error:', err));
        }
      }
    }

    await review.deleteOne(); // This will trigger the post('deleteOne') hook to update Product stats

    res.status(200).json({
      success: true,
      message: 'Review removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
};

// @desc    Vote on a review (helpful, not_helpful, spam)
// @route   POST /api/reviews/:id/vote
// @access  Private
export const voteReview = async (req, res) => {
  try {
    const { value } = req.body; // 'helpful', 'not_helpful', 'spam'
    const userId = req.user.id;

    if (!['helpful', 'not_helpful', 'spam'].includes(value)) {
      return res.status(400).json({ success: false, message: 'Invalid vote type' });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user already voted
    const existingVoteIndex = review.votes.findIndex(v => v.user.toString() === userId);

    if (existingVoteIndex >= 0) {
      // If clicking the same vote again, remove the vote (toggle)
      if (review.votes[existingVoteIndex].value === value) {
        review.votes.splice(existingVoteIndex, 1);
      } else {
        // Change vote type
        review.votes[existingVoteIndex].value = value;
      }
    } else {
      // Add new vote
      review.votes.push({ user: userId, value });
    }

    await review.save({ validateBeforeSave: false }); // Skip hook triggers unless required

    res.status(200).json({
      success: true,
      message: 'Vote registered successfully',
      votes: review.votes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register vote', error: error.message });
  }
};
