import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate totals before saving
cartSchema.pre('save', function (next) {
  let totalPrice = 0;
  let totalDiscount = 0;

  this.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    if (item.discountPrice > 0) {
      totalDiscount += (item.price - item.discountPrice) * item.quantity;
    }
  });

  this.totalPrice = totalPrice;
  this.totalDiscount = totalDiscount;
  this.finalPrice = totalPrice - totalDiscount - this.couponDiscount;

  next();
});

export default mongoose.model('Cart', cartSchema);