import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import Category from './models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

// Categories templates list
const CATEGORIES_TO_ENSURE = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Sports & Outdoors',
  'Beauty & Health',
  'Toys & Games',
  'Baby Products',
  'Automotive',
  'Pet Supplies',
  'Garden & Outdoors',
  'Office & Stationery',
  'Musical Instruments',
  'Accessories',
  'Home Appliances',
  'Gaming Gear'
];

const BRANDS = {
  electronics: ['Samsung', 'Apple', 'OnePlus', 'Google', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Sony', 'JBL', 'Logitech', 'Razer', 'Keychron', 'Corsair', 'Redragon', 'Bose', 'Sennheiser'],
  clothing: ['Nike', 'Adidas', 'Puma', 'Zara', 'Levi\'s', 'Reebok', 'H&M', 'Tommy Hilfiger', 'Calvin Klein', 'U.S. Polo', 'Jack & Jones'],
  shoes: ['Nike', 'Adidas', 'Puma', 'Reebok', 'ASICS', 'Skechers', 'Woodland', 'Crocs'],
  books: ['Penguin', 'HarperCollins', 'O\'Reilly', 'Wiley', 'Random House', 'Macmillan', 'Scholastic'],
  home: ['Philips', 'Prestige', 'Usha', 'Bajaj', 'Morphy Richards', 'Dyson', 'Kent', 'Havells'],
  accessories: ['Anker', 'Belkin', 'Spigen', 'Portronics', 'Ambrane', 'SanDisk']
};

const SPEC_TEMPLATES = {
  smartphone: {
    'Screen Size': '6.7 inches',
    'Resolution': 'FHD+ AMOLED',
    'RAM': '8GB LPDDR5',
    'Storage': '256GB UFS 4.0',
    'Processor': 'Octa-Core Octane Gen 2',
    'Battery': '5000 mAh',
    'Charging': '67W Fast Charging'
  },
  laptop: {
    'Processor': 'Intel Core i7 13th Gen',
    'RAM': '16GB DDR5',
    'Storage': '512GB NVMe SSD',
    'Graphics': 'Intel Iris Xe Graphics',
    'Screen Size': '15.6 inches',
    'Operating System': 'Windows 11 Home'
  },
  earbuds: {
    'Battery Life': 'Up to 30 hours',
    'Noise Cancellation': 'Active Noise Cancellation (ANC)',
    'Bluetooth': 'v5.3',
    'Water Resistance': 'IPX4 Rated',
    'Driver Size': '10mm Dynamic'
  },
  keyboard: {
    'Switch Type': 'Mechanical Red Switches',
    'Backlight': 'RGB Customizable',
    'Connectivity': 'Wired/Wireless 2.4GHz',
    'Key Rollover': 'Full N-Key Rollover'
  },
  mouse: {
    'DPI': '16,000 DPI Max',
    'Sensor': 'Optical High Precision',
    'Buttons': '6 Programmable Buttons',
    'Weight': '85g Lightweight'
  }
};

// Unique Unsplash Image IDs lists to guarantee diversity
const UNSPLASH_IMAGES = {
  smartphone: [
    'photo-1511707171634-5f897ff02aa9',
    'photo-1598327105666-5b89351aff97',
    'photo-1565849906461-096573c7a140',
    'photo-1580910051074-3eb694886505',
    'photo-1510557880182-3d4d3cba35a5',
    'photo-1523206489230-c012c64b2b48',
    'photo-1551645121-d1034da75057',
    'photo-1573148195900-7845dcb9b127'
  ],
  laptop: [
    'photo-1496181130204-7552cc154d88',
    'photo-1588872657578-7efd1f1555ed',
    'photo-1517336714731-489689fd1ca8',
    'photo-1603302576837-37561b2e2302',
    'photo-1525547719571-a2d4ac8945e2',
    'photo-1484788984921-03950022c9ef',
    'photo-1504707748692-419802cf939d',
    'photo-1531297484001-80022131f5a1'
  ],
  earbuds: [
    'photo-1590658268037-6bf12165a8df',
    'photo-1505740420928-5e560c06d30e',
    'photo-1546435770-a3e426bf472b',
    'photo-1583394838336-acd977736f90',
    'photo-1484704849700-f032a568e944',
    'photo-1577174881658-0f30ed549adc',
    'photo-1608156639585-b3a032ef9689'
  ],
  keyboard: [
    'photo-1618384887929-16ec33fab9ef',
    'photo-1587829741301-dc798b83add3',
    'photo-1626908013351-800ddd734b8a',
    'photo-1601445638532-3c6f6c3aa1d6'
  ],
  mouse: [
    'photo-1615663245857-ac93bb7c39e7',
    'photo-1625854659532-f80a0b2c15ab',
    'photo-1613040809024-b4ef7ba99bc3'
  ],
  book: [
    'photo-1544947950-fa07a98d237f',
    'photo-1506880018603-83d5b814b5a6',
    'photo-1512820790803-83ca734da794',
    'photo-1532012197267-da84d127e765',
    'photo-1497633762265-9d179a990aa6',
    'photo-1516979187457-637abb4f9353'
  ],
  clothing: [
    'photo-1523381210434-271e8be1f52b',
    'photo-1583743814966-8936f5b7be1a',
    'photo-1489987707025-afc232f7ea0f',
    'photo-1434389677669-e08b4cac3105',
    'photo-1479064555552-3ef4979f8908',
    'photo-1503342217505-b0a15ec3261c'
  ],
  shoes: [
    'photo-1542291026-7eec264c27ff',
    'photo-1606107557195-0e29a4b5b4aa',
    'photo-1608231387042-66d1773070a5',
    'photo-1595950653106-6c9ebd614d3a',
    'photo-1520639888713-7851133b1ed0',
    'photo-1460353581641-37baddab0fa2'
  ],
  home: [
    'photo-1527018601619-a508a2be00cd',
    'photo-1583847268964-b28dc8f51f92',
    'photo-1567401893930-f17285c5c292',
    'photo-1585418694458-dc8085ab01d2'
  ]
};

const getImageUrl = (category, index) => {
  const ids = UNSPLASH_IMAGES[category] || UNSPLASH_IMAGES.home;
  const imageId = ids[index % ids.length];
  // Using direct unsplash source photo url structure
  return `https://images.unsplash.com/${imageId}?w=500&auto=format&fit=crop&q=80`;
};

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in .env.local');
    }

    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully!');

    // 1. Ensure all categories are created
    console.log('🏗️ Verifying and seeding categories...');
    const catMap = {};
    for (const catName of CATEGORIES_TO_ENSURE) {
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = new Category({ name: catName, slug: catName.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') });
        await cat.save();
        console.log(`- Created Category: ${catName}`);
      }
      catMap[catName.toLowerCase()] = cat._id;
    }

    // Assign categories IDs
    const electroId = catMap['electronics'];
    const clothId = catMap['clothing'];
    const bookId = catMap['books'];
    const sportsId = catMap['sports & outdoors'];
    const homeId = catMap['home & kitchen'];
    const accId = catMap['accessories'];
    const applianceId = catMap['home appliances'];
    const gearId = catMap['gaming gear'];

    console.log('🧹 Cleaning old mock catalog items (brand products)...');
    await Product.deleteMany({ sku: { $regex: /^NC-SEED-/ } });
    console.log('Cleanup finished.');

    console.log('🏗️ Generating 11,500 products in memory...');
    const productsToInsert = [];

    // Loop variables
    let skuIndex = 0;

    // 1. Smartphones (1,500 products)
    const phoneBrands = BRANDS.electronics.slice(0, 8); // Samsung, Apple, OnePlus, Google, Xiaomi, Oppo, Vivo, Realme
    const phoneModels = ['Galaxy X-Pro', 'iPhone Alpha', 'Nord Elite', 'Pixel Core', 'Redmi Note Ultra', 'Oppo Reno Extreme', 'Vivo V-Series Pro', 'Realme Narzo Prime'];
    for (let i = 0; i < 1500; i++) {
      const brand = phoneBrands[i % phoneBrands.length];
      const model = phoneModels[i % phoneModels.length];
      const name = `${brand} ${model} v${i + 1}`;
      const price = 5000 + (i * 110); // ₹5,000 to ₹1,70,000
      const discountPrice = i % 5 === 0 ? 0 : Math.round(price * 0.9);
      
      productsToInsert.push({
        name,
        description: `High quality smartphone by ${brand}. Designed with high-capacity battery, dynamic screen size, premium resolution, and multi-core CPU. Fits various budget preferences.`,
        price,
        discountPrice,
        category: electroId,
        image: getImageUrl('smartphone', i),
        brand,
        stock: 5 + (i % 90),
        sku: `NC-SEED-PH-${skuIndex++}`,
        rating: 3.5 + ((i % 16) / 10), // 3.5 to 5.0
        reviews: 5 + (i % 200),
        specifications: SPEC_TEMPLATES.smartphone,
        isActive: true,
        isFeatured: i % 100 === 0,
        isTrending: i % 60 === 0,
        tags: ['smartphone', 'phone', 'mobile', brand.toLowerCase()],
        keywords: ['smartphone', 'phone', 'mobile', brand.toLowerCase()]
      });
    }

    // 2. Laptops (1,200 products)
    const laptopBrands = BRANDS.electronics.slice(8, 12); // Dell, HP, Lenovo, ASUS
    const laptopSeries = ['Inspiron Ultra', 'Pavilion Slim', 'ThinkPad Business', 'ZenBook Nano'];
    for (let i = 0; i < 1200; i++) {
      const brand = laptopBrands[i % laptopBrands.length];
      const series = laptopSeries[i % laptopSeries.length];
      const name = `${brand} ${series} Book-${i + 1}`;
      const price = 25000 + (i * 180); // ₹25,000 to ₹2,41,000
      const discountPrice = i % 7 === 0 ? 0 : Math.round(price * 0.92);
      
      productsToInsert.push({
        name,
        description: `Premium professional laptop by ${brand}. Outfitted with fast SSD storage, robust computing power, multi-tasking RAM capacity, and vivid display size. Great for coding, study, and gaming.`,
        price,
        discountPrice,
        category: electroId,
        image: getImageUrl('laptop', i),
        brand,
        stock: 5 + (i % 50),
        sku: `NC-SEED-LT-${skuIndex++}`,
        rating: 3.8 + ((i % 13) / 10),
        reviews: 10 + (i % 150),
        specifications: SPEC_TEMPLATES.laptop,
        isActive: true,
        isFeatured: i % 80 === 0,
        isTrending: i % 50 === 0,
        tags: ['laptop', 'computer', 'notebook', brand.toLowerCase()],
        keywords: ['laptop', 'computer', 'notebook', brand.toLowerCase()]
      });
    }

    // 3. Audio & Earbuds (1,500 products)
    const audioBrands = ['Sony', 'JBL', 'boAt', 'Sennheiser', 'Apple', 'Bose', 'Beats'];
    for (let i = 0; i < 1500; i++) {
      const brand = audioBrands[i % audioBrands.length];
      const isEarbud = i % 2 === 0;
      const name = isEarbud ? `${brand} BassPods Wireless Earbuds v${i + 1}` : `${brand} Acoustic Pro Headphones x${i + 1}`;
      const price = 600 + (i * 25); // ₹600 to ₹38,100
      const discountPrice = i % 6 === 0 ? 0 : Math.round(price * 0.88);
      
      productsToInsert.push({
        name,
        description: `High-fidelity audio product by ${brand}. Features high battery longevity, Active Noise Cancellation (ANC), IPX4 sweatproof water resistance, and crystal-clear sound signature.`,
        price,
        discountPrice,
        category: electroId,
        image: getImageUrl('earbuds', i),
        brand,
        stock: 10 + (i % 120),
        sku: `NC-SEED-EB-${skuIndex++}`,
        rating: 3.9 + ((i % 12) / 10),
        reviews: 15 + (i % 300),
        specifications: SPEC_TEMPLATES.earbuds,
        isActive: true,
        isFeatured: i % 120 === 0,
        tags: [isEarbud ? 'earbuds' : 'headphone', 'audio', 'sound', brand.toLowerCase()],
        keywords: [isEarbud ? 'earbuds' : 'headphone', 'audio', 'sound', brand.toLowerCase()]
      });
    }

    // 4. Peripherals: Keyboards & Mice (1,000 products)
    const peripheralBrands = ['Logitech', 'Razer', 'Keychron', 'Corsair', 'Redragon', 'HP', 'Dell'];
    for (let i = 0; i < 1000; i++) {
      const brand = peripheralBrands[i % peripheralBrands.length];
      const isKybd = i % 2 === 0;
      const name = isKybd ? `${brand} Mechanical Keyboard K-${i + 1}` : `${brand} Wireless Optical Mouse M-${i + 1}`;
      const price = 300 + (i * 12); // ₹300 to ₹12,300
      const discountPrice = i % 4 === 0 ? 0 : Math.round(price * 0.9);
      
      productsToInsert.push({
        name,
        description: isKybd 
          ? `Responsive mechanical keyboard from ${brand} with ergonomic key caps, RGB customization, and customizable travel switches.`
          : `Precision wireless mouse from ${brand} featuring adjustable DPI settings, high optical sensor resolution, and lightweight form factor.`,
        price,
        discountPrice,
        category: electroId,
        image: isKybd ? getImageUrl('keyboard', i) : getImageUrl('mouse', i),
        brand,
        stock: 20 + (i % 80),
        sku: `NC-SEED-KM-${skuIndex++}`,
        rating: 4.0 + ((i % 11) / 10),
        reviews: 20 + (i % 250),
        specifications: isKybd ? SPEC_TEMPLATES.keyboard : SPEC_TEMPLATES.mouse,
        isActive: true,
        tags: [isKybd ? 'keyboard' : 'mouse', 'peripherals', 'pc', brand.toLowerCase()],
        keywords: [isKybd ? 'keyboard' : 'mouse', 'peripherals', 'pc', brand.toLowerCase()]
      });
    }

    // 5. Accessories (Chargers, Cables, Stands) - 1,200 products
    const accBrands = BRANDS.accessories;
    const accTypes = ['Fast Charger 45W', 'USB-C Cable Braided', 'Premium Laptop Stand', 'Wireless Charge Dock', 'Car Mount Holder', 'Ergonomic Desk Mat'];
    for (let i = 0; i < 1200; i++) {
      const brand = accBrands[i % accBrands.length];
      const type = accTypes[i % accTypes.length];
      const name = `${brand} ${type} Lite-${i + 1}`;
      const price = 199 + (i * 6); // ₹199 to ₹7,399
      const discountPrice = i % 8 === 0 ? 0 : Math.round(price * 0.85);

      productsToInsert.push({
        name,
        description: `Highly durable smartphone and laptop charging accessory by ${brand}. Rigorously tested for power delivery efficiency, device compatibility, and safety standards.`,
        price,
        discountPrice,
        category: accId,
        image: getImageUrl('home', i),
        brand,
        stock: 50 + (i % 200),
        sku: `NC-SEED-AC-${skuIndex++}`,
        rating: 3.7 + ((i % 14) / 10),
        reviews: 5 + (i % 180),
        specifications: { 'Output': 'PD 3.0 Standard', 'Material': 'Double Braided Nylon/ABS' },
        isActive: true,
        tags: ['charger', 'cable', 'mount', 'stand', 'accessory', brand.toLowerCase()],
        keywords: ['charger', 'cable', 'mount', 'stand', 'accessory', brand.toLowerCase()]
      });
    }

    // 6. Books (1,000 products)
    const authors = ['Robert C. Martin', 'Dale Carnegie', 'J.K. Rowling', 'Stephen King', 'George Orwell', 'James Clear', 'Dan Brown'];
    const genre = ['Education', 'Self-Help', 'Fantasy', 'Thriller', 'Classic Literature', 'Non-Fiction'];
    for (let i = 0; i < 1000; i++) {
      const brand = BRANDS.books[i % BRANDS.books.length];
      const author = authors[i % authors.length];
      const bookGenre = genre[i % genre.length];
      const name = `The Chronicle of ${bookGenre} - Vol ${i + 1}`;
      const price = 150 + (i * 2.5); // ₹150 to ₹2,650
      
      productsToInsert.push({
        name,
        description: `An engaging and deeply insightful book exploring ${bookGenre}. Written by renowned author ${author} and published under ${brand}. Ideal for readers of all levels.`,
        price,
        discountPrice: 0,
        category: bookId,
        image: getImageUrl('book', i),
        brand,
        stock: 15 + (i % 40),
        sku: `NC-SEED-BK-${skuIndex++}`,
        rating: 4.0 + ((i % 11) / 10),
        reviews: 5 + (i % 100),
        specifications: { 'Author': author, 'Genre': bookGenre, 'Format': 'Paperback', 'Pages': '380' },
        isActive: true,
        tags: ['book', 'reading', bookGenre.toLowerCase(), author.toLowerCase()],
        keywords: ['book', 'reading', bookGenre.toLowerCase(), author.toLowerCase()]
      });
    }

    // 7. Clothing (1,500 products - including shirts, pants, and Jeans!)
    const clothBrands = BRANDS.clothing;
    const clothTypes = ['Cotton Polo Shirt', 'Graphic Tee Shirt', 'Comfort Fit Cargo Pants', 'Full Zip Hoodie', 'Stretch Chino Pant', 'Winter Sweatshirt', 'Slim Fit Denim Jeans', 'Classic Denim Jeans Pant'];
    for (let i = 0; i < 1500; i++) {
      const brand = clothBrands[i % clothBrands.length];
      const type = clothTypes[i % clothTypes.length];
      const name = `${brand} Casual ${type}-${i + 1}`;
      const price = 399 + (i * 5); // ₹399 to ₹7,899
      const discountPrice = i % 5 === 0 ? 0 : Math.round(price * 0.9);

      productsToInsert.push({
        name,
        description: `Comfortable and modern apparel clothing by ${brand}. Tailored using high quality cotton-blend fabric for a premium breathable fit. Perfect casual fit.`,
        price,
        discountPrice,
        category: clothId,
        image: getImageUrl('clothing', i),
        brand,
        stock: 30 + (i % 150),
        sku: `NC-SEED-CL-${skuIndex++}`,
        rating: 3.6 + ((i % 15) / 10),
        reviews: 12 + (i % 220),
        specifications: { 'Material': 'Cotton Denim Blend', 'Wash': 'Machine Wash Cold', 'Sizes': 'S, M, L, XL' },
        isActive: true,
        tags: ['shirt', 'tshirt', 'pant', 'jeans', 'clothing', 'fashion', brand.toLowerCase()],
        keywords: ['shirt', 'tshirt', 'pant', 'jeans', 'clothing', 'fashion', brand.toLowerCase()]
      });
    }

    // 8. Shoes & Sports Equipment (1,500 products - including running shoes, basketballs, footballs, and cricket kits!)
    const shoeBrands = BRANDS.shoes;
    // Types containing: Sneakers, Basketballs, Footballs, Cricket kits!
    const sportsTypes = [
      'Air Runner Max Shoes', 
      'Classic Court Sneaker', 
      'Ultralight Jogger Shoes', 
      'Trail Training Shoe', 
      'Comfort Slide Sandal', 
      'Official Leather Basketball Pro', 
      'Premium Cricket Bat Willow', 
      'Complete Sports Cricket Kit Bag', 
      'Pro League Soccer Football'
    ];
    for (let i = 0; i < 1500; i++) {
      const brand = shoeBrands[i % shoeBrands.length];
      const type = sportsTypes[i % sportsTypes.length];
      const name = `${brand} ${type} v${i + 1}`;
      const price = 799 + (i * 12); // ₹799 to ₹18,799
      const discountPrice = i % 6 === 0 ? 0 : Math.round(price * 0.92);
      
      const isFootwear = type.includes('Shoes') || type.includes('Sneaker') || type.includes('Sandal') || type.includes('Jogger');

      productsToInsert.push({
        name,
        description: isFootwear 
          ? `Premium performance footwear by ${brand}. Features cushion comfort insoles, shock dispersion midlayers, and mesh upper layer for ventilation.`
          : `High durability professional grade sports equipment by ${brand}. Designed for tournaments, workouts, and team sports activities.`,
        price,
        discountPrice,
        category: sportsId,
        image: getImageUrl('shoes', i),
        brand,
        stock: 15 + (i % 90),
        sku: `NC-SEED-SH-${skuIndex++}`,
        rating: 3.9 + ((i % 12) / 10),
        reviews: 20 + (i % 350),
        specifications: { 'Material': 'Rubber/Synthetics/Willow', 'Sole': 'High Grip Sole', 'Use': 'Sports and Active Outdoor Play' },
        isActive: true,
        tags: ['shoes', 'sneaker', 'basketball', 'cricket', 'football', 'sports', brand.toLowerCase()],
        keywords: ['shoes', 'sneaker', 'basketball', 'cricket', 'football', 'sports', brand.toLowerCase()]
      });
    }

    // 9. Home Appliances (600 products - including vacuum cleaners, purifiers, and sweets/candies boxes!)
    const appBrands = BRANDS.home;
    const appTypes = [
      'Air Purifier HEPA', 
      'Smart Steam Iron', 
      'Dry Vacuum Cleaner', 
      'Digital Induction Cooktop', 
      'Tower Cooling Fan', 
      'Assorted Chocolate Candy Gift Box', 
      'Premium Sweet Caramel Candies Jar'
    ];
    for (let i = 0; i < 600; i++) {
      const brand = appBrands[i % appBrands.length];
      const type = appTypes[i % appTypes.length];
      const name = `${brand} ${type} Elite-${i + 1}`;
      const price = 250 + (i * 75); // ₹250 to ₹45,250
      const discountPrice = i % 4 === 0 ? 0 : Math.round(price * 0.9);
      
      const isCandy = type.includes('Candy') || type.includes('Candies');

      productsToInsert.push({
        name,
        description: isCandy
          ? `Delicious organic candy treats from ${brand}. Prepared under completely hygienic conditions with zero artificial preservatives. Perfect for home snacking.`
          : `High performance smart home appliance from ${brand}. Features low energy power consumption, high safety ratings, and modern ergonomic design presets.`,
        price,
        discountPrice,
        category: isCandy ? homeId : applianceId, // Candies belong to Home & Kitchen, appliances to Home Appliances
        image: getImageUrl('home', i),
        brand,
        stock: 10 + (i % 40),
        sku: `NC-SEED-HA-${skuIndex++}`,
        rating: 4.0 + ((i % 11) / 10),
        reviews: 8 + (i % 90),
        specifications: { 'Power': isCandy ? 'N/A' : '1200 Watts', 'Warranty': isCandy ? 'N/A' : '2 Year Limited Warranty' },
        isActive: true,
        tags: ['appliance', 'home', 'candy', 'chocolate', 'sweets', brand.toLowerCase()],
        keywords: ['appliance', 'home', 'candy', 'chocolate', 'sweets', brand.toLowerCase()]
      });
    }

    // 10. Gaming Gear (500 products)
    const gearBrands = ['Razer', 'Corsair', 'ASUS ROG', 'Logitech G', 'SteelSeries'];
    const gearTypes = ['Mechanical Gaming Keyboard RGB', 'High DPI Optical Gaming Mouse', 'RGB Surround Sound Headset', 'USB Console Controller', 'Streaming Capture Deck'];
    for (let i = 0; i < 500; i++) {
      const brand = gearBrands[i % gearBrands.length];
      const type = gearTypes[i % gearTypes.length];
      const name = `${brand} ${type} Pro-${i + 1}`;
      const price = 1200 + (i * 65); // ₹1,200 to ₹33,700
      const discountPrice = i % 5 === 0 ? 0 : Math.round(price * 0.88);

      productsToInsert.push({
        name,
        description: `Pro level gaming hardware accessory by ${brand}. Features high responsiveness index, custom RGB profile patterns, and tournament grade specifications.`,
        price,
        discountPrice,
        category: gearId,
        image: getImageUrl('keyboard', i),
        brand,
        stock: 8 + (i % 50),
        sku: `NC-SEED-GG-${skuIndex++}`,
        rating: 4.1 + ((i % 10) / 10),
        reviews: 12 + (i % 180),
        specifications: { 'Interface': 'USB 3.0 / Wireless 2.4Ghz', 'Latency': '1ms Input Response' },
        isActive: true,
        tags: ['gear', 'gaming', 'pc', brand.toLowerCase()],
        keywords: ['gear', 'gaming', 'pc', brand.toLowerCase()]
      });
    }

    console.log(`Writing ${productsToInsert.length} products to database in chunks...`);
    const CHUNK_SIZE = 2000;
    let totalInserted = 0;
    for (let i = 0; i < productsToInsert.length; i += CHUNK_SIZE) {
      const chunk = productsToInsert.slice(i, i + CHUNK_SIZE);
      const inserted = await Product.insertMany(chunk);
      totalInserted += inserted.length;
      console.log(`Inserted chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(productsToInsert.length / CHUNK_SIZE)} (${totalInserted} total)`);
    }
    console.log(`🎉 Successfully seeded ${totalInserted} new products into MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log('Disconnected from database successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
};

run();
