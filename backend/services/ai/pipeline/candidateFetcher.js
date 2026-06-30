import { Product, Category } from '../../../models/index.js';

export const fetchCandidates = async (intent) => {
  // If query intent contains no category, brand, and keywords, return empty list directly
  if (!intent.category && !intent.brand && (!intent.keywords || intent.keywords.length === 0)) {
    return [];
  }

  let queryObj = { isActive: true };

  // 1. Category match check
  let categoryId = null;
  if (intent.category) {
    const categoryDoc = await Category.findOne({ name: new RegExp('^' + intent.category + 's?$', 'i') });
    if (categoryDoc) {
      categoryId = categoryDoc._id;
      queryObj.category = categoryId;
    } else {
      // Fallback: If the parsed category is not in Category collection,
      // treat it as an essential keyword for the regex query.
      if (!intent.keywords.includes(intent.category)) {
        intent.keywords.push(intent.category);
      }
    }
  }

  // 2. Brand match
  if (intent.brand) {
    queryObj.brand = new RegExp('^' + intent.brand + '$', 'i');
  }

  // 3. Keyword matching (matching name/desc)
  if (intent.keywords && intent.keywords.length > 0) {
    const keywordRegexes = intent.keywords.map(kw => new RegExp(kw, 'i'));
    queryObj.$or = [
      { name: { $in: keywordRegexes } },
      { description: { $in: keywordRegexes } }
    ];
  }

  let candidates = await Product.find(queryObj).populate('category', 'name');

  // If strict query yields 0 results, relax keywords filter (but prevent full table scans)
  if (candidates.length === 0 && intent.keywords && intent.keywords.length > 0) {
    if (categoryId || intent.brand) {
      console.log('⚠️ Strict query yielded 0 results. Relaxing keywords constraint...');
      const relaxedQuery = { isActive: true };
      if (categoryId) relaxedQuery.category = categoryId;
      if (intent.brand) relaxedQuery.brand = new RegExp('^' + intent.brand + '$', 'i');
      
      candidates = await Product.find(relaxedQuery).populate('category', 'name');
    }
  }

  // If still empty and brand was queried, relax brand filter
  if (candidates.length === 0 && intent.brand) {
    console.log('⚠️ Query yielded 0 results. Relaxing brand constraint...');
    const relaxedQuery = { isActive: true };
    if (categoryId) relaxedQuery.category = categoryId;
    
    candidates = await Product.find(relaxedQuery).populate('category', 'name');
  }

  // Do NOT return generic products. Return empty array if no match is found within category/brand/keyword context.
  return candidates;
};
