import { Conversation, AIAnalytics, Product } from '../../models/index.js';
import { normalizeQuery } from './pipeline/queryNormalizer.js';
import { parseIntent } from './pipeline/intentParser.js';
import { fetchCandidates } from './pipeline/candidateFetcher.js';
import { calculateRelevance } from './pipeline/relevanceEngine.js';
import { SEARCH_CONFIG } from '../../config/search.js';
import { AI_CONFIG } from '../../config/ai.js';
import providerFactory from './providers/providerFactory.js';
import FallbackProvider from './providers/fallbackProvider.js';
import { getProductRichContext } from './productContext.js';

class AIService {
  // Existing product details insights
  async getInsights(productId) {
    const context = await getProductRichContext(productId);
    const providerConfig = AI_CONFIG.provider;
    const provider = providerFactory.getProvider(providerConfig);
    const isGemini = provider.constructor.name === 'GeminiProvider';

    try {
      const insights = await provider.generateInsights(context);
      if (this.validateInsights(insights)) {
        return {
          success: true,
          provider: isGemini ? 'gemini' : 'fallback',
          data: insights
        };
      }
    } catch (error) {
      console.error('❌ AI Service Error in insights generation:', error.message);
    }

    const fallback = new FallbackProvider();
    const fallbackData = await fallback.generateInsights(context);
    return {
      success: true,
      provider: 'fallback',
      data: fallbackData
    };
  }

  // Existing product Q&A
  async answerQuestion(productId, question) {
    const context = await getProductRichContext(productId);
    const providerConfig = AI_CONFIG.provider;
    const provider = providerFactory.getProvider(providerConfig);
    const isGemini = provider.constructor.name === 'GeminiProvider';

    try {
      const answer = await provider.answerQuestion(context, question);
      if (answer && answer.trim().length > 0) {
        return {
          success: true,
          provider: isGemini ? 'gemini' : 'fallback',
          answer: answer
        };
      }
    } catch (error) {
      console.error('❌ AI Service Error in question answering:', error.message);
    }

    const fallback = new FallbackProvider();
    const answer = await fallback.answerQuestion(context, question);
    return {
      success: true,
      provider: 'fallback',
      answer: answer
    };
  }

  validateInsights(insights) {
    return (
      insights &&
      typeof insights === 'object' &&
      typeof insights.summary === 'string' &&
      insights.summary.length > 0 &&
      Array.isArray(insights.pros) &&
      Array.isArray(insights.cons) &&
      typeof insights.bestFor === 'string' &&
      Array.isArray(insights.alternatives)
    );
  }

  // Milestone 3: Conversational Search Recommendations with dynamic LLM ranking
  async recommendProducts(query, conversationId, userId = null) {
    const startTime = Date.now();
    const timings = {
      intentParsing: 0,
      mongoQuery: 0,
      relevanceEngine: 0,
      gemini: 0,
      formatting: 0
    };

    // 1. Session and Memory Retrieval
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      conversation = new Conversation({ user: userId });
    }

    // 2. Query Normalization & Intent Parsing (Milestone 1)
    const t0 = Date.now();
    const normalized = normalizeQuery(query);
    const intent = parseIntent(normalized);
    
    // Merge context from previous conversation state (conversational memory)
    if (conversation.extractedContext) {
      if (!intent.category && conversation.extractedContext.lastCategory) {
        intent.category = conversation.extractedContext.lastCategory;
      }
      if (intent.maxPrice === null && conversation.extractedContext.budget) {
        intent.maxPrice = conversation.extractedContext.budget;
      }
      if (!intent.brand && conversation.extractedContext.brand) {
        intent.brand = conversation.extractedContext.brand;
      }
    }
    
    // Save updated context inside conversation document
    conversation.extractedContext = {
      lastCategory: intent.category || conversation.extractedContext?.lastCategory || null,
      budget: intent.maxPrice !== null ? intent.maxPrice : (conversation.extractedContext?.budget || null),
      brand: intent.brand || conversation.extractedContext?.brand || null,
      keywords: [...new Set([...(intent.keywords || []), ...(conversation.extractedContext?.keywords || [])])].slice(0, 10)
    };
    
    timings.intentParsing = Date.now() - t0;

    // Catalog Awareness Filter Check:
    // Check if the query maps to any supported categories/aliases in our store
    const queryWords = normalized.split(/\s+/);
    const hasSupportedTerm = queryWords.some(word => {
      const canonical = SEARCH_CONFIG.CATEGORY_ALIASES[word] || word;
      return SEARCH_CONFIG.SUPPORTED_CATEGORIES.includes(canonical);
    });

    const hasBrandMatch = intent.brand !== null;

    if (!hasSupportedTerm && !hasBrandMatch) {
      const cleanCategoryWords = queryWords.filter(
        w => !['under', 'above', 'around', 'between', 'with', 'for', 'and', 'with', 'in', 'near'].includes(w) && isNaN(w)
      );
      const friendlyCategory = cleanCategoryWords.slice(0, 2).join(' ') || 'these products';
      const friendlyCategoryPlural = friendlyCategory.endsWith('s') ? friendlyCategory : `${friendlyCategory}s`;
      const totalTime = Date.now() - startTime;
      
      return {
        version: '1.0',
        conversationId: conversation._id,
        summary: `We don't currently sell ${friendlyCategoryPlural} at NextCart.`,
        provider: 'rules_engine',
        confidence: 'high',
        matches: [],
        suggestions: [
          'Explore Laptops',
          'Explore Smartphones',
          'Explore Accessories',
          'Explore Audio Earbuds'
        ],
        timings,
        latency: totalTime
      };
    }

    // 3. MongoDB Candidate Fetching (Milestone 2)
    const t1 = Date.now();
    const candidates = await fetchCandidates(intent);
    timings.mongoQuery = Date.now() - t1;

    // 4. Relevance Calculation & Sorting (Milestone 2)
    const t2 = Date.now();
    const preScored = candidates.map(prod => {
      const rel = calculateRelevance(prod, intent);
      return {
        product: prod,
        matchScore: rel.matchScore,
        scoreBreakdown: rel.scoreBreakdown
      };
    });

    // Sort by matchScore descending
    preScored.sort((a, b) => b.matchScore - a.matchScore);
    
    // Minimum Relevance Threshold Guard (Drop candidates scoring below 70%)
    const qualifiedScored = preScored.filter(
      item => item.matchScore >= SEARCH_CONFIG.MINIMUM_RELEVANCE_THRESHOLD
    );
    
    const topScored = qualifiedScored.slice(0, SEARCH_CONFIG.MAX_CANDIDATES);
    timings.relevanceEngine = Date.now() - t2;

    // 5. Provider Execution (Gemini Ranking - Milestone 3)
    const t3 = Date.now();
    const providerConfig = AI_CONFIG.provider;
    const provider = providerFactory.getProvider(providerConfig);
    const isGemini = provider.constructor.name === 'GeminiProvider';
    
    let rankingsData;
    let fallbackUsed = false;
    let validationPassed = false;
    let fallbackReason = null;

    // Call model ONLY if qualified candidate matches pass the 70% relevance threshold
    if (topScored.length > 0) {
      try {
        rankingsData = await provider.recommendProducts(topScored, query);
        
        // Output Schema Validation Check
        if (this.validateRankings(rankingsData, topScored.length)) {
          validationPassed = true;
        } else {
          fallbackReason = 'JSON response structure validation failed';
          console.warn(`⚠️ AI Service: Gemini index rankings validation failed (${fallbackReason}), cascading to fallback provider...`);
          const fallback = new FallbackProvider();
          rankingsData = await fallback.recommendProducts(topScored, query);
          fallbackUsed = true;
        }
      } catch (error) {
        fallbackReason = error.message;
        console.error('❌ AI Service: Gemini recommendations failed, cascading to fallback...', fallbackReason);
        const fallback = new FallbackProvider();
        rankingsData = await fallback.recommendProducts(topScored, query);
        fallbackUsed = true;
      }
    } else {
      // Direct empty matching suggestions builder
      const fallback = new FallbackProvider();
      rankingsData = await fallback.recommendProducts([], query);
    }
    
    timings.gemini = Date.now() - t3;

    // 6. Formatting & Hydration (Milestone 3)
    const t4 = Date.now();
    
    // Map AI ranked index list back to candidates documents list
    // Strict Budget Match Rule: products exceeding target budget constraints are mapped as alternatives
    const matchedProducts = [];
    const closestAlternatives = [];

    if (rankingsData.rankings && Array.isArray(rankingsData.rankings)) {
      rankingsData.rankings.forEach(rank => {
        const candidateItem = topScored[rank.index];
        if (candidateItem) {
          const price = candidateItem.product.discountPrice || candidateItem.product.price;
          
          if (intent.maxPrice !== null && price > intent.maxPrice) {
            closestAlternatives.push({
              product: candidateItem.product,
              price: price
            });
          } else {
            matchedProducts.push({
              product: candidateItem.product,
              matchScore: rank.matchScore || candidateItem.matchScore,
              scoreBreakdown: candidateItem.scoreBreakdown,
              reasons: rank.reasons || []
            });
          }
        }
      });
    }

    // Dynamic confidence score derived directly from top matched score
    let confidence = 'low';
    const topMatch = matchedProducts.length > 0 ? matchedProducts[0] : null;
    if (topMatch) {
      const score = topMatch.matchScore;
      if (score >= 95) confidence = 'high';
      else if (score >= 80) confidence = 'medium';
      else confidence = 'low';
    } else {
      confidence = rankingsData.confidence || 'low';
    }

    // Friendly empty state messages builder
    const suggestions = [];
    let summary = rankingsData.summary;

    if (matchedProducts.length === 0) {
      if (intent.maxPrice) {
        summary = `We couldn't find any products within your ₹${intent.maxPrice.toLocaleString('en-IN')} budget.`;
        suggestions.push(`Here are the closest alternatives in our catalog:`);
        if (closestAlternatives.length > 0) {
          closestAlternatives.sort((a, b) => a.price - b.price);
          closestAlternatives.slice(0, 3).forEach(alt => {
            suggestions.push(`View closest option: ${alt.product.name} (₹${alt.price.toLocaleString('en-IN')})`);
          });
        }
      } else {
        // Broad category match failure (such as "Best gaming phone under 30000" yielding no smartphone)
        const friendlyName = intent.category ? `${intent.category}s` : 'matching products';
        const priceLabel = intent.maxPrice ? ` under ₹${intent.maxPrice.toLocaleString('en-IN')}` : '';
        
        summary = `I couldn't find any suitable ${friendlyName}${priceLabel} in our database.`;
        suggestions.push('Possible reasons:');
        suggestions.push('• No matching items exist in our catalog currently.');
        if (intent.maxPrice) {
          suggestions.push('• Budget threshold may be too tight.');
          suggestions.push('Try removing budget filters or search for alternative accessory ranges.');
        }
      }
    } else {
      if (rankingsData.suggestions && Array.isArray(rankingsData.suggestions)) {
        suggestions.push(...rankingsData.suggestions);
      } else {
        suggestions.push('Compare match choices.');
      }
    }

    const totalTime = Date.now() - startTime;
    timings.formatting = Date.now() - t4;

    // Search Stage structured logger
    console.log(`\n🔍 [AI Search Stage Log]`);
    console.log(`- Normalized Query: "${normalized}"`);
    console.log(`- Intent: ${JSON.stringify(intent)}`);
    console.log(`- Mongo Candidates Count: ${candidates.length}`);
    console.log(`- Pre-scored Candidates: ${preScored.length}`);
    console.log(`- Sent to AI count: ${topScored.length}`);
    console.log(`- Active Provider: ${isGemini ? 'gemini' : 'fallback'}`);
    console.log(`- Fallback Triggered: ${fallbackUsed ? 'YES' : 'NO'}`);
    if (fallbackUsed && fallbackReason) {
      console.log(`- Fallback Reason: ${fallbackReason}`);
    }
    console.log(`- Validation Passed: ${validationPassed ? 'YES' : 'NO'}`);
    console.log(`- Returned Matches: ${matchedProducts.length}`);
    console.log(`- Latency: ${totalTime}ms`);
    console.log(`───────────────────────────────\n`);

    const payload = {
      version: '1.0',
      conversationId: conversation._id,
      summary,
      provider: isGemini && !fallbackUsed ? 'gemini' : 'fallback',
      confidence,
      matches: matchedProducts,
      suggestions,
      timings,
      latency: totalTime
    };

    // Save message logs inside conversation memory
    conversation.recentMessages.push({
      role: 'user',
      text: query
    });
    conversation.recentMessages.push({
      role: 'assistant',
      text: payload.summary,
      provider: payload.provider
    });

    // Capping conversations log to 15 exchanges
    if (conversation.recentMessages.length > SEARCH_CONFIG.MAX_HISTORY * 2) {
      conversation.recentMessages = conversation.recentMessages.slice(-SEARCH_CONFIG.MAX_HISTORY * 2);
    }
    await conversation.save();

    // Log to AIAnalytics collection
    const analytics = new AIAnalytics({
      conversationId: conversation._id,
      query,
      provider: payload.provider,
      timings,
      latency: totalTime,
      cacheHit: false,
      candidateCount: candidates.length,
      resultCount: matchedProducts.length,
      confidence,
      fallbackUsed
    });
    await analytics.save();

    return payload;
  }

  validateRankings(output, maxCandidates) {
    if (!output || typeof output !== 'object') return false;
    if (typeof output.summary !== 'string' || output.summary.length === 0) return false;
    if (!['high', 'medium', 'low'].includes(output.confidence)) return false;
    if (!Array.isArray(output.rankings)) return false;
    
    const matchedIndexes = new Set();
    for (const rank of output.rankings) {
      if (typeof rank.index !== 'number' || rank.index < 0 || rank.index >= maxCandidates) return false;
      if (matchedIndexes.has(rank.index)) return false;
      matchedIndexes.add(rank.index);
      if (typeof rank.matchScore !== 'number') return false;
      if (!Array.isArray(rank.reasons) || rank.reasons.length < 2) return false;
    }
    return true;
  }
}

export default new AIService();
