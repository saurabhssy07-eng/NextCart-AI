
import mongoose from 'mongoose';
import Cart from './backend/models/Cart.js';

const test = async () => {
  await mongoose.connect('mongodb://localhost:27017/nextcart-ai' || 'mongodb://127.0.0.1:27017/nextcart-ai');
  const cart = await Cart.findOne().populate('items.product');
  if (cart) {
    console.log('Cart total price:', cart.totalPrice);
    console.log('Items:');
    cart.items.forEach(i => {
      console.log(\- \ | qty: \ | price: \ | discountPrice: \\);
    });
  } else {
    console.log('No cart found');
  }
  process.exit(0);
};
test().catch(console.error);

