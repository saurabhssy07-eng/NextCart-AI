
import mongoose from 'mongoose';
import Product from './backend/models/Product.js';
mongoose.connect('mongodb://localhost:27017/nextcart-ai').then(async () => {
  const jeans = await Product.find({ name: /jeans/i }).limit(5);
  console.log('Jeans regex count:', jeans.length);
  try {
    const jeansText = await Product.find({ $text: { $search: 'jeans' } }).limit(5);
    console.log('Jeans text count:', jeansText.length);
  } catch (e) {
    console.log('Text index error:', e.message);
  }
  process.exit(0);
});

