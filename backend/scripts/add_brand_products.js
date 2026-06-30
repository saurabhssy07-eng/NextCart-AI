import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

import Category from './models/Category.js';
import Product from './models/Product.js';

const newProducts = [
  // ================= ADIDAS =================
  { name: 'Adidas Originals Essential T-Shirt', brand: 'Adidas', categoryName: 'Clothing', price: 1499, discountPrice: 1299, stock: 50, image: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?w=400', description: 'Classic comfortable cotton t-shirt with signature Adidas logo.', tags: ['adidas', 'tshirt', 'cloth', 'men'] },
  { name: 'Adidas Tiro 23 Track Pants (Lower)', brand: 'Adidas', categoryName: 'Clothing', price: 2999, discountPrice: 2499, stock: 40, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', description: 'Moisture-absorbing track pants for sports and casual wear.', tags: ['adidas', 'lower', 'pants', 'sports'] },
  { name: 'Adidas Classic Sports Backpack', brand: 'Adidas', categoryName: 'Sports & Outdoors', price: 1999, discountPrice: 1599, stock: 30, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Durable and spacious backpack for gym and travel.', tags: ['adidas', 'bag', 'backpack', 'sports'] },
  { name: 'Adidas Ultraboost Running Shoes', brand: 'Adidas', categoryName: 'Sports & Outdoors', price: 12999, discountPrice: 10999, stock: 20, image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400', description: 'High-performance running shoes with incredible energy return.', tags: ['adidas', 'shoes', 'running', 'sports'] },

  // ================= SONY =================
  { name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', categoryName: 'Electronics', price: 29990, discountPrice: 26990, stock: 15, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', description: 'Industry-leading noise cancellation headphones.', tags: ['sony', 'headphones', 'audio', 'wireless'] },
  { name: 'Sony PlayStation 5 Console', brand: 'Sony', categoryName: 'Electronics', price: 54990, discountPrice: 49990, stock: 5, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', description: 'Next-gen gaming console with ultra-high speed SSD.', tags: ['sony', 'ps5', 'gaming', 'console'] },
  { name: 'Sony Bravia 55-inch 4K Ultra HD TV', brand: 'Sony', categoryName: 'Electronics', price: 65990, discountPrice: 57990, stock: 8, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', description: 'Stunning 4K resolution with Triluminos pro display.', tags: ['sony', 'tv', 'television', '4k'] },

  // ================= NIKE =================
  { name: 'Nike Air Max 270 Sneakers', brand: 'Nike', categoryName: 'Sports & Outdoors', price: 11995, discountPrice: 9995, stock: 25, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'Nike lifestyle shoe features our biggest heel Air unit yet.', tags: ['nike', 'shoes', 'sneakers', 'sports'] },
  { name: 'Nike Dri-FIT Training Gym T-Shirt', brand: 'Nike', categoryName: 'Clothing', price: 1895, discountPrice: 1495, stock: 60, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', description: 'Sweat-wicking fabric helps keep you dry and comfortable.', tags: ['nike', 'tshirt', 'cloth', 'gym'] },
  { name: 'Nike Heritage Waistpack Bag', brand: 'Nike', categoryName: 'Sports & Outdoors', price: 1295, discountPrice: 995, stock: 45, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', description: 'Lightweight bag for everyday essentials.', tags: ['nike', 'bag', 'accessories'] },

  // ================= APPLE =================
  { name: 'Apple iPhone 15 Pro Max', brand: 'Apple', categoryName: 'Electronics', price: 159900, discountPrice: 149900, stock: 10, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', description: 'Forged in titanium. A17 Pro chip. 48MP Main camera.', tags: ['apple', 'iphone', 'smartphone', 'mobile'] },
  { name: 'Apple MacBook Pro M3 14-inch', brand: 'Apple', categoryName: 'Electronics', price: 169900, discountPrice: 159900, stock: 12, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', description: 'Mind-blowing performance with the M3 chip.', tags: ['apple', 'macbook', 'laptop', 'computer'] },
  { name: 'Apple Watch Series 9', brand: 'Apple', categoryName: 'Electronics', price: 41900, discountPrice: 39900, stock: 20, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', description: 'Smarter. Brighter. Mightier smartwatch.', tags: ['apple', 'watch', 'smartwatch', 'wearable'] },

  // ================= SAMSUNG =================
  { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', categoryName: 'Electronics', price: 129999, discountPrice: 119999, stock: 15, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', description: 'Galaxy AI is here. Epic cameras and performance.', tags: ['samsung', 'galaxy', 'smartphone', 'mobile'] },
  { name: 'Samsung Galaxy Tab S9', brand: 'Samsung', categoryName: 'Electronics', price: 72999, discountPrice: 65999, stock: 18, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', description: 'Premium Android tablet with S Pen included.', tags: ['samsung', 'tablet', 'ipad-alternative'] },

  // ================= PUMA =================
  { name: 'Puma One8 Virat Kohli Men\'s T-Shirt', brand: 'Puma', categoryName: 'Clothing', price: 1999, discountPrice: 1299, stock: 35, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400', description: 'Premium cotton blend activewear from the One8 collection.', tags: ['puma', 'tshirt', 'cloth', 'sports'] },
  { name: 'Puma Smash v2 Leather Sneakers', brand: 'Puma', categoryName: 'Sports & Outdoors', price: 3499, discountPrice: 2199, stock: 25, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', description: 'Classic tennis-inspired everyday sneakers.', tags: ['puma', 'shoes', 'sneakers'] },

  // ================= ZARA =================
  { name: 'Zara Men\'s Textured Suit Jacket', brand: 'Zara', categoryName: 'Clothing', price: 8990, discountPrice: 7990, stock: 15, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', description: 'Elegant slim-fit suit jacket for formal occasions.', tags: ['zara', 'blazer', 'suit', 'men'] },
  { name: 'Zara Women\'s Pleated Midi Dress', brand: 'Zara', categoryName: 'Clothing', price: 4990, discountPrice: 3990, stock: 25, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400', description: 'Flowy midi dress perfect for summer events.', tags: ['zara', 'dress', 'women', 'fashion'] },

  // ================= H&M =================
  { name: 'H&M Relaxed Fit Hoodie', brand: 'H&M', categoryName: 'Clothing', price: 2299, discountPrice: 1799, stock: 40, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', description: 'Comfortable oversized hoodie in soft sweatshirt fabric.', tags: ['hm', 'hoodie', 'sweatshirt', 'cloth'] },
  { name: 'H&M Regular Fit Cargo Pants', brand: 'H&M', categoryName: 'Clothing', price: 2999, discountPrice: 2499, stock: 30, image: 'https://images.unsplash.com/photo-1624378439575-d1ead6af0093?w=400', description: 'Trendy cargo pants with multiple utility pockets.', tags: ['hm', 'pants', 'cargo', 'lower'] },

  // ================= LEVI'S =================
  { name: 'Levi\'s 501 Original Fit Jeans', brand: 'Levi\'s', categoryName: 'Clothing', price: 3999, discountPrice: 3199, stock: 60, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'The original blue jean with a classic straight fit.', tags: ['levis', 'jeans', 'denim', 'pants'] },
  { name: 'Levi\'s Classic Trucker Denim Jacket', brand: 'Levi\'s', categoryName: 'Clothing', price: 5499, discountPrice: 4599, stock: 25, image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ea?w=400', description: 'Iconic denim jacket that looks good on everyone.', tags: ['levis', 'jacket', 'denim'] },

  // ================= UNDER ARMOUR =================
  { name: 'Under Armour Tech 2.0 T-Shirt', brand: 'Under Armour', categoryName: 'Sports & Outdoors', price: 2299, discountPrice: 1899, stock: 35, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', description: 'Loose, light, and keeps you cool during workouts.', tags: ['under armour', 'tshirt', 'gym', 'sports'] },
  { name: 'Under Armour Project Rock Duffle Bag', brand: 'Under Armour', categoryName: 'Sports & Outdoors', price: 5999, discountPrice: 4999, stock: 15, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Water-resistant, incredibly durable gym duffle bag.', tags: ['under armour', 'bag', 'duffle', 'sports'] },
];

async function seedBrandProducts() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextcart';
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    
    // 1. Reset brand for all products to fix the 'random products' issue
    console.log('Clearing random brands from existing products...');
    await Product.updateMany({}, { $set: { brand: null } });

    // 2. Fetch all categories to map categoryName to category _id
    const categories = await Category.find();
    
    // 3. Prepare the new products
    const productsToInsert = newProducts.map(prod => {
      const cat = categories.find(c => c.name === prod.categoryName) || categories[0];
      return {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        category: cat._id, // Assign the proper Category ObjectId
        brand: prod.brand,
        stock: prod.stock,
        image: prod.image,
        tags: prod.tags,
        sku: `BRND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        isFeatured: true,
      };
    });

    console.log(`Inserting ${productsToInsert.length} brand-specific products...`);
    await Product.insertMany(productsToInsert);

    console.log('Successfully seeded brand products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedBrandProducts();
