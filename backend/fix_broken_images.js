import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Product } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextcart';

// Map of broken URLs to working replacement URLs (using valid Unsplash photo IDs)
const imageFixes = {
  // Wireless Earbuds Pro - use a different earbuds photo
  'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400': 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400',
  // Mechanical Gaming Keyboard - use a different keyboard photo
  'https://images.unsplash.com/photo-1541140532154-b024d1e0c356?w=400': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
  // Women's Kurta Set - use a different ethnic wear photo
  'https://images.unsplash.com/photo-1583391733956-6c782764164b?w=400': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  // Smart LED Bulb - use a different bulb photo
  'https://images.unsplash.com/photo-1576504732343-fc5940ea1d78?w=400': 'https://images.unsplash.com/photo-1555434992-2b9368f2e6ef?w=400',
  // Mountain Bike 21-Speed - use a different bike photo  
  'https://images.unsplash.com/photo-1576435728678-68d0fbf94e4e?w=400': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
  // Soft Plush Teddy Bear - use a different teddy photo
  'https://images.unsplash.com/photo-1567515002184-21904a6e3b3a?w=400': 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=400',
  // Action Figure Superhero Collection - use a different toy photo
  'https://images.unsplash.com/photo-1608889825205-e3d14b42af79?w=400': 'https://images.unsplash.com/photo-1566576912322-044f19e3eb0f?w=400',
  // Baby Diaper Premium Pack - use a different baby product photo
  'https://images.unsplash.com/photo-1584828284968-3b757ecb1024?w=400': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
  // Baby Stroller - use a different stroller photo
  'https://images.unsplash.com/photo-1591871937573-74d2y797?w=400': 'https://images.unsplash.com/photo-1591871937573-74d2a797?w=400',
  // Desk Lamp LED - use a different lamp photo
  'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
};

const fixImages = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let fixedCount = 0;
    for (const [oldUrl, newUrl] of Object.entries(imageFixes)) {
      const result = await Product.updateMany(
        { image: oldUrl },
        { $set: { image: newUrl } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Fixed ${result.modifiedCount} product(s): ${oldUrl.substring(0, 60)}...`);
        fixedCount += result.modifiedCount;
      }
    }

    console.log(`\n🎉 Total products fixed: ${fixedCount}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

fixImages();
