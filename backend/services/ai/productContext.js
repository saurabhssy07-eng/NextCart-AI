import { Product, Review } from '../../models/index.js';

export const getProductRichContext = async (productId) => {
  // 1. Fetch Product
  const product = await Product.findById(productId).populate('category', 'name');
  if (!product) {
    throw new Error('Product not found');
  }

  // 2. Fetch Reviews
  const reviews = await Review.find({ product: productId }).populate('user', 'firstName');

  // 3. Compile Review Context
  const reviewCount = reviews.length;
  const averageRating = product.averageRating || 0;
  
  // Sentiment categorization
  const positiveReviews = reviews.filter(r => r.rating >= 4);
  const negativeReviews = reviews.filter(r => r.rating <= 2);
  
  const topPositive = positiveReviews.slice(0, 3).map(r => r.comment);
  const topNegative = negativeReviews.slice(0, 3).map(r => r.comment);
  
  const allCommentsText = reviews.map(r => `${r.title} ${r.comment}`).join(' ').toLowerCase();
  const commonKeywords = [];
  ['comfort', 'durable', 'quality', 'price', 'fast', 'slow', 'heavy', 'battery', 'screen', 'sound'].forEach(word => {
    if (allCommentsText.includes(word)) {
      commonKeywords.push(word);
    }
  });

  const reviewsSummaryContext = {
    count: reviewCount,
    averageRating,
    topPositive: topPositive.length > 0 ? topPositive : ['No major positive feedback logged.'],
    topNegative: topNegative.length > 0 ? topNegative : ['No major negative feedback logged.'],
    commonKeywords: commonKeywords.slice(0, 5)
  };

  // 4. Fetch Related Products (same category, excluding current product, limit 3)
  const related = await Product.find({
    category: product.category?._id || product.category,
    _id: { $ne: product._id }
  })
  .select('name price averageRating brand')
  .limit(3);

  const relatedProductsContext = related.map(p => ({
    name: p.name,
    brand: p.brand,
    price: p.price,
    averageRating: p.averageRating || 0
  }));

  // 5. Structure Product details
  const productContext = {
    name: product.name,
    brand: product.brand,
    category: product.category?.name || 'General',
    description: product.description,
    specifications: product.specifications || {},
    variants: product.variants || [],
    images: product.images || [],
    price: product.price,
    discountPrice: product.discountPrice || null,
    stock: product.stock || 0,
    averageRating: product.averageRating || 0,
    reviewCount
  };

  return {
    product: productContext,
    reviews: reviewsSummaryContext,
    relatedProducts: relatedProductsContext
  };
};
