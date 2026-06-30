import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const brandList = ['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Puma', 'Zara', 'H&M', "Levi's", 'Under Armour'];

async function updateBrands() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextcart';
    console.log('Connecting to', uri.substring(0, 20) + '...');
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const products = await db.collection('products').find().toArray();
    
    console.log(`Found ${products.length} products. Updating brands...`);
    
    for (let i = 0; i < products.length; i++) {
      const brand = brandList[i % brandList.length];
      await db.collection('products').updateOne(
        { _id: products[i]._id },
        { $set: { brand: brand } }
      );
    }
    
    console.log('Successfully assigned brands to all products!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBrands();
