import NodeCache from 'node-cache';
import crypto from 'crypto';
import aiService from '../services/ai/aiService.js';
import { SEARCH_CONFIG } from '../config/search.js';
import { AI_CONFIG } from '../config/ai.js';
import { Product } from '../models/index.js';

// Cache instance: 15 minutes TTL (900 seconds)
const aiCache = new NodeCache({ stdTTL: SEARCH_CONFIG.CACHE_TTL, checkperiod: 120 });

// Simple analytics logger helper
const logAIAnalytics = ({ event, productId, latency, provider, cacheHit, fallbackUsed, success, error }) => {
  console.log(`\n📊 [AI Analytics - ${event}]`);
  console.log(`- Product ID: ${productId}`);
  console.log(`- Latency: ${latency}ms`);
  console.log(`- Provider: ${provider || 'N/A'}`);
  console.log(`- Cache: ${cacheHit ? 'HIT' : 'MISS'}`);
  console.log(`- Fallback Engaged: ${fallbackUsed ? 'YES' : 'NO'}`);
  console.log(`- Status: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (error) console.log(`- Error Detail: ${error}`);
  console.log(`──────────────────────────────────\n`);
};

export const getProductInsights = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;

  try {
    const cachedData = aiCache.get(id);
    if (cachedData) {
      logAIAnalytics({
        event: 'AI Summary Viewed',
        productId: id,
        latency: Date.now() - startTime,
        provider: cachedData.provider,
        cacheHit: true,
        fallbackUsed: cachedData.provider === 'fallback',
        success: true
      });
      return res.status(200).json(cachedData);
    }

    const result = await aiService.getInsights(id);
    aiCache.set(id, result);

    logAIAnalytics({
      event: 'AI Summary Viewed',
      productId: id,
      latency: Date.now() - startTime,
      provider: result.provider,
      cacheHit: false,
      fallbackUsed: result.provider === 'fallback',
      success: true
    });

    res.status(200).json(result);
  } catch (error) {
    logAIAnalytics({
      event: 'AI Summary Viewed',
      productId: id,
      latency: Date.now() - startTime,
      provider: 'unknown',
      cacheHit: false,
      fallbackUsed: false,
      success: false,
      error: error.message
    });
    res.status(500).json({ success: false, message: 'Failed to retrieve insights', error: error.message });
  }
};

export const answerProductQuestion = async (req, res) => {
  const startTime = Date.now();
  const { id } = req.params;
  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }

  const questionHash = crypto.createHash('md5').update(question.trim().toLowerCase()).digest('hex');
  const cacheKey = `${id}_${questionHash}`;

  try {
    const cachedData = aiCache.get(cacheKey);
    if (cachedData) {
      logAIAnalytics({
        event: 'AI Question Asked',
        productId: id,
        latency: Date.now() - startTime,
        provider: cachedData.provider,
        cacheHit: true,
        fallbackUsed: cachedData.provider === 'fallback',
        success: true
      });
      return res.status(200).json(cachedData);
    }

    const result = await aiService.answerQuestion(id, question);
    aiCache.set(cacheKey, result);

    logAIAnalytics({
      event: 'AI Question Asked',
      productId: id,
      latency: Date.now() - startTime,
      provider: result.provider,
      cacheHit: false,
      fallbackUsed: result.provider === 'fallback',
      success: true
    });

    res.status(200).json(result);
  } catch (error) {
    logAIAnalytics({
      event: 'AI Question Asked',
      productId: id,
      latency: Date.now() - startTime,
      provider: 'unknown',
      cacheHit: false,
      fallbackUsed: false,
      success: false,
      error: error.message
    });
    res.status(500).json({ success: false, message: 'Failed to answer question', error: error.message });
  }
};

export const getAiRecommendations = async (req, res) => {
  const startTime = Date.now();
  const { query, conversationId } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    // Fetch latest catalog modification version for cache key mapping
    const latestProduct = await Product.findOne().sort({ updatedAt: -1 }).select('updatedAt');
    const catalogVersion = latestProduct ? latestProduct.updatedAt.getTime().toString() : 'v1';

    const providerConfig = AI_CONFIG.provider;
    const queryHash = crypto.createHash('md5').update((query.trim() + '_' + (conversationId || '') + '_' + catalogVersion).toLowerCase()).digest('hex');
    // Incorporate provider to prevent caching conflicts if provider settings change
    const cacheKey = `recommend_${providerConfig}_${conversationId || 'guest'}_${queryHash}`;

    // 1. Check Cache
    const cachedData = aiCache.get(cacheKey);
    if (cachedData) {
      logAIAnalytics({
        event: 'AI Recommendations',
        productId: 'N/A',
        latency: Date.now() - startTime,
        provider: cachedData.provider,
        cacheHit: true,
        fallbackUsed: cachedData.provider === 'fallback',
        success: true
      });
      return res.status(200).json({ success: true, ...cachedData, cached: true });
    }

    // 2. Fetch recommendations
    const payload = await aiService.recommendProducts(query, conversationId, userId);
    
    // Save to cache
    aiCache.set(cacheKey, payload);

    logAIAnalytics({
      event: 'AI Recommendations',
      productId: 'N/A',
      latency: Date.now() - startTime,
      provider: payload.provider,
      cacheHit: false,
      fallbackUsed: payload.provider === 'fallback',
      success: true
    });

    res.status(200).json({ success: true, ...payload, cached: false });
  } catch (error) {
    logAIAnalytics({
      event: 'AI Recommendations',
      productId: 'N/A',
      latency: Date.now() - startTime,
      provider: 'unknown',
      cacheHit: false,
      fallbackUsed: false,
      success: false,
      error: error.message
    });
    res.status(500).json({ success: false, message: 'Failed to retrieve recommendations', error: error.message });
  }
};
