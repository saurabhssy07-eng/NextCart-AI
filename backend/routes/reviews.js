import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  voteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public route to get reviews for a product
router.get('/:productId', getProductReviews);

// Protected routes
// Use upload.array('images', 5) to allow up to 5 images
router.post('/:productId', protect, upload.array('images', 5), createReview);

router.put('/:id', protect, upload.array('images', 5), updateReview);

router.delete('/:id', protect, deleteReview);

router.post('/:id/vote', protect, voteReview);

export default router;
