
import mongoose from 'mongoose';
import Product from './backend/models/Product.js';
mongoose.connect('mongodb://localhost:27017/nextcart-ai' || 'mongodb://127.0.0.1:27017/nextcart-ai').then(async () => {
  const books = await Product.find({ category: '64d60b37... wait, I need to find by name' });
  const sampleBooks = await Product.find({ name: /The Chronicle of/ }).limit(3);
  console.log('Books:', sampleBooks.map(b => ({ name: b.name, image: b.image })));
  const sampleCandies = await Product.find({ name: /Caramel Candies/ }).limit(3);
  console.log('Candies:', sampleCandies.map(c => ({ name: c.name, image: c.image })));
  process.exit(0);
});

