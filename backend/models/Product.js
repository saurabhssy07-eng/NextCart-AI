import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400',
    },
    images: [
      {
        url: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
    },
    seller: {
      type: String,
      default: 'NextCart AI',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    keywords: [String],
    // Indian specific fields
    maxOrderQuantity: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    brand: {
      type: String,
      default: null,
    },
    // Trending and categorization
    isTrending: {
      type: Boolean,
      default: false,
    },
    trendingRank: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for searching
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
