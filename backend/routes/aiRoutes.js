import express from 'express';
import rateLimit from 'express-rate-limit';
import { getProductInsights, answerProductQuestion, getAiRecommendations } from '../controllers/aiController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for passive insights (60 requests per minute)
const insightsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { success: false, message: 'Too many requests for product insights. Please try again later.' }
});

// Rate limiter for interactive QA & recommend (20 requests per minute)
const qaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'Too many questions/searches asked. Please slow down and try again later.' }
});

router.post('/product/:id/insights', insightsLimiter, getProductInsights);
router.post('/product/:id/qa', protect, qaLimiter, answerProductQuestion);
router.post('/recommend', optionalProtect, qaLimiter, getAiRecommendations);

export default router;
