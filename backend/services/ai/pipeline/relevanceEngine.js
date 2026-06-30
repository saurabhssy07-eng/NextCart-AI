import { SEARCH_CONFIG } from '../../../config/search.js';

export const calculateRelevance = (product, intent) => {
  const weights = SEARCH_CONFIG.RELEVANCE_WEIGHTS;
  
  // 1. Category Score (45%)
  let categoryScore = 0;
  if (!intent.category) {
    categoryScore = weights.category;
  } else {
    const prodCat = (product.category?.name || product.category || '').toString().toLowerCase();
    const queryCat = intent.category.toLowerCase();
    const name = (product.name || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    
    if (prodCat.includes(queryCat) || queryCat.includes(prodCat)) {
      categoryScore = weights.category;
    } else if (name.includes(queryCat) || desc.includes(queryCat)) {
      categoryScore = weights.category * 0.9; // High match since keyword or name aligns
    }

    // Negative modifier check to prevent accessory leaks
    const negativeModifiers = {
      'laptop': ['backpack', 'bag', 'sleeve', 'case', 'charger', 'stand', 'cooler', 'dock', 'mouse pad'],
      'smartphone': ['charger', 'cable', 'mount', 'stand', 'holder', 'case', 'cover', 'glass', 'screen protector', 'lens', 'headphone', 'earphone']
    };

    const parsedCatLower = intent.category.toLowerCase();
    const canonicalCat = SEARCH_CONFIG.CATEGORY_ALIASES[parsedCatLower] || parsedCatLower;

    if (negativeModifiers[canonicalCat]) {
      const hasNegativeModifier = negativeModifiers[canonicalCat].some(mod => name.includes(mod));
      if (hasNegativeModifier) {
        categoryScore = 0; // Penalize accessory matches to 0 category score
      }
    }
  }

  // 2. Keyword Score (25%)
  let keywordScore = 0;
  if (!intent.keywords || intent.keywords.length === 0) {
    keywordScore = weights.keyword;
  } else {
    let matches = 0;
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const specs = JSON.stringify(product.specifications || {}).toLowerCase();
    
    intent.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (name.includes(kwLower)) matches += 2.0;
      else if (specs.includes(kwLower)) matches += 1.5;
      else if (desc.includes(kwLower)) matches += 1.0;
      else if (brand.includes(kwLower)) matches += 1.0;
    });

    const maxPossible = intent.keywords.length * 2.0;
    const ratio = Math.min(matches / maxPossible, 1.0);
    keywordScore = ratio * weights.keyword;
  }

  // 3. Brand Score (15%)
  let brandScore = 0;
  if (!intent.brand) {
    brandScore = weights.brand;
  } else {
    const prodBrand = (product.brand || '').toLowerCase();
    const queryBrand = intent.brand.toLowerCase();
    if (prodBrand.includes(queryBrand) || queryBrand.includes(prodBrand)) {
      brandScore = weights.brand;
    }
  }

  // 4. Budget Score (10%)
  let budgetScore = 0;
  const price = product.discountPrice || product.price;
  
  if (intent.minPrice === null && intent.maxPrice === null) {
    budgetScore = weights.budget;
  } else {
    const min = intent.minPrice !== null ? intent.minPrice : 0;
    const max = intent.maxPrice !== null ? intent.maxPrice : Infinity;
    
    if (price >= min && price <= max) {
      budgetScore = weights.budget;
    } else if (price > max) {
      const margin = max * 0.4;
      const overage = price - max;
      if (overage < margin) {
        budgetScore = (1.0 - (overage / margin)) * weights.budget * 0.5;
      }
    } else if (price < min) {
      const margin = min * 0.4;
      const underage = min - price;
      if (underage < margin) {
        budgetScore = (1.0 - (underage / margin)) * weights.budget * 0.7;
      }
    }
  }

  // 5. Rating Score (5%)
  const ratingScore = ((product.averageRating || 0) / 5.0) * weights.rating;

  // Compile breakdown
  const rawScore = categoryScore + keywordScore + brandScore + budgetScore + ratingScore;
  const matchScore = Math.round(rawScore * 100);

  return {
    matchScore: Math.min(Math.max(matchScore, 0), 100),
    scoreBreakdown: {
      category: Math.round(categoryScore * 100),
      keyword: Math.round(keywordScore * 100),
      brand: Math.round(brandScore * 100),
      budget: Math.round(budgetScore * 100),
      rating: Math.round(ratingScore * 100)
    }
  };
};
