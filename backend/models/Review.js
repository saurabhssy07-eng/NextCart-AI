import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null, // Keep for later when Orders are implemented
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Please provide a review title'],
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: 1000,
    },
    images: [
      {
        url: String,
        publicId: String, // Added publicId for Cloudinary cleanup
      },
    ],
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        value: {
          type: String,
          enum: ['helpful', 'not_helpful', 'spam'],
        }
      }
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Changed to approved for immediate visibility
    },
    editedAt: {
      type: Date,
      default: null,
    },
    responses: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create unique index for one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating and update Product
reviewSchema.statics.calcAverageRatings = async function (productId) {
  // Aggregate basic stats
  const stats = await this.aggregate([
    {
      $match: { product: productId, status: 'approved' }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // Aggregate distribution
  const distribution = await this.aggregate([
    {
      $match: { product: productId, status: 'approved' }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    }
  ]);

  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  distribution.forEach(d => {
    ratingDistribution[d._id] = d.count;
  });

  try {
    if (stats.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviews: stats[0].nRating,
        ratingDistribution
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: 0,
        reviews: 0,
        ratingDistribution
      });
    }
  } catch (err) {
    console.error('Error updating product ratings:', err);
  }
};

// Call calcAverageRatings after saving a review
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

// Call calcAverageRatings after updating/removing
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.constructor.calcAverageRatings(this.product);
});

export default mongoose.model('Review', reviewSchema);
