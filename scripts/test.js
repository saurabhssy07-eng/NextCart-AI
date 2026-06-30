
import mongoose from 'mongoose';
import('./backend/models/Product.js').then(async ({ default: Product }) => {
  await mongoose.connect('mongodb://localhost:27017/nextcart-ai' || 'mongodb://127.0.0.1:27017/nextcart-ai');
  const products = await Product.find({ name: { $regex: 'jeans', $options: 'i' } }).limit(5);
  console.log('Jeans products:', products.length);
  const total = await Product.countDocuments();
  console.log('Total products:', total);
  process.exit(0);
}).catch(console.error);

