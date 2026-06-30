import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Product } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextcart';

const updateImages = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let count = 0;
    
    for (const product of products) {
      // Use picsum.photos with the product's unique ID as the seed
      const uniqueUrl = `https://picsum.photos/seed/${product._id}/400/400`;
      
      // Also generate some variant images
      const images = [
        { url: uniqueUrl, alt: `${product.name} Main View` },
        { url: `https://picsum.photos/seed/${product._id}_2/400/400`, alt: `${product.name} Side View` },
        { url: `https://picsum.photos/seed/${product._id}_3/400/400`, alt: `${product.name} Detail View` }
      ];

      await Product.updateOne(
        { _id: product._id },
        { $set: { image: uniqueUrl, images: images } }
      );
      count++;
    }

    console.log(`\n🎉 Total products updated with unique images: ${count}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateImages();
