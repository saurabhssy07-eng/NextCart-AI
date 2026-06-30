const BRANDS = [
  'samsung', 'apple', 'oneplus', 'google', 'xiaomi', 'oppo', 'vivo', 'realme', 
  'dell', 'hp', 'lenovo', 'asus', 'sony', 'jbl', 'logitech', 'razer', 'keychron', 
  'corsair', 'redragon', 'bose', 'sennheiser', 'nike', 'adidas', 'puma', 'zara', 
  'levis', 'reebok', 'hm', 'tommy', 'calvin', 'polo', 'jack', 'anker', 'belkin', 
  'spigen', 'portronics', 'ambrane', 'sandisk', 'philips', 'prestige', 'usha', 
  'bajaj', 'morphy', 'dyson', 'kent', 'havells'
];

const CATEGORIES = [
  'laptop', 'laptops', 'phone', 'phones', 'mobile', 'mobiles', 'smartphone', 
  'smartphones', 'television', 'televisions', 'tv', 'tvs', 'earbuds', 'earbud', 
  'earphone', 'earphones', 'headphone', 'headphones', 'shoe', 'shoes', 'sneaker', 
  'sneakers', 'clothing', 'clothes', 'shirt', 'shirts', 'tshirt', 'tshirts', 
  'pant', 'pants', 'jeans', 'jean', 'denim', 'book', 'books', 'keyboard', 
  'keyboards', 'mouse', 'mice', 'accessory', 'accessories', 'charger', 'chargers', 
  'cable', 'cables', 'mount', 'mounts', 'stand', 'stands', 'appliance', 'appliances', 
  'gear', 'candy', 'candies', 'basketball', 'basketballs', 'cricket', 
  'football', 'footballs', 'ball', 'balls', 'bat', 'bats'
];

const CATEGORY_ALIASES = {
  'phone': 'smartphone',
  'phones': 'smartphone',
  'mobile': 'smartphone',
  'mobiles': 'smartphone',
  'smartphone': 'smartphone',
  'smartphones': 'smartphone',
  'laptop': 'laptop',
  'laptops': 'laptop',
  'tv': 'television',
  'tvs': 'television',
  'television': 'television',
  'televisions': 'television',
  'book': 'book',
  'books': 'book',
  'clothing': 'clothing',
  'clothes': 'clothing',
  'tshirt': 'clothing',
  'tshirts': 'clothing',
  'shirt': 'clothing',
  'shirts': 'clothing',
  'pant': 'clothing',
  'pants': 'clothing',
  'jeans': 'clothing',
  'jean': 'clothing',
  'denim': 'clothing',
  'shoe': 'shoes',
  'shoes': 'shoes',
  'sneaker': 'shoes',
  'sneakers': 'shoes',
  'headphone': 'headphone',
  'headphones': 'headphone',
  'earbud': 'earbuds',
  'earbuds': 'earbuds',
  'keyboard': 'keyboard',
  'keyboards': 'keyboard',
  'mouse': 'mouse',
  'mice': 'mouse',
  'accessory': 'accessories',
  'accessories': 'accessories',
  'charger': 'accessories',
  'chargers': 'accessories',
  'cable': 'accessories',
  'cables': 'accessories',
  'mount': 'accessories',
  'mounts': 'accessories',
  'stand': 'accessories',
  'stands': 'accessories',
  'appliance': 'home appliances',
  'appliances': 'home appliances',
  'home appliance': 'home appliances',
  'home appliances': 'home appliances',
  'gear': 'gaming gear',
  'gaming gear': 'gaming gear',
  'basketball': 'sports & outdoors',
  'basketballs': 'sports & outdoors',
  'football': 'sports & outdoors',
  'footballs': 'sports & outdoors',
  'cricket': 'sports & outdoors',
  'cricket kit': 'sports & outdoors',
  'bat': 'sports & outdoors',
  'ball': 'sports & outdoors',
  'candy': 'home & kitchen',
  'candies': 'home & kitchen'
};

const parsePriceWithK = (valStr) => {
  let val = parseFloat(valStr.replace(/[^\d.]/g, ''));
  if (valStr.toLowerCase().includes('k')) {
    val = val * 1000;
  }
  return val;
};

export const parseIntent = (normalizedQuery) => {
  const intent = {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    keywords: [],
    sortBy: 'relevance'
  };

  if (!normalizedQuery) return intent;

  // Process emoji query normalization (map emojis to singular canonical text terms)
  let queryText = normalizedQuery;
  const emojiMap = {
    '📱': 'smartphone',
    '💻': 'laptop',
    '👟': 'shoe',
    '🎧': 'headphone',
    '📺': 'television'
  };
  Object.entries(emojiMap).forEach(([emoji, text]) => {
    queryText = queryText.replace(emoji, text);
  });

  const words = queryText.split(/\s+/);

  // 1. Brand Detection
  const foundBrand = words.find(w => BRANDS.includes(w));
  if (foundBrand) {
    intent.brand = foundBrand.charAt(0).toUpperCase() + foundBrand.slice(1);
  }

  // 2. Category Detection
  const foundCategory = [...words].reverse().find(w => CATEGORIES.includes(w));
  if (foundCategory) {
    const canonical = CATEGORY_ALIASES[foundCategory] || foundCategory;
    intent.category = canonical;
    if (!intent.keywords.includes(foundCategory)) {
      intent.keywords.push(foundCategory);
    }
  }

  // 3. Price Filter Extraction
  const rangeRegex = /(?:between|from)\s+([\d.]+k?)\s+(?:and|to)\s+([\d.]+k?)/i;
  const rangeMatch = queryText.match(rangeRegex);
  if (rangeMatch) {
    intent.minPrice = parsePriceWithK(rangeMatch[1]);
    intent.maxPrice = parsePriceWithK(rangeMatch[2]);
  } else {
    // Under / below / budget / limit / less than
    const maxRegex = /(?:under|below|less\s+than|less\s+than\s+or\s+equal\s+to|<=?|price\s+limit|budget|max)\s+([\d.]+k?)/i;
    const maxMatch = queryText.match(maxRegex);
    if (maxMatch) {
      intent.maxPrice = parsePriceWithK(maxMatch[1]);
    }

    // Above / over / more than
    const minRegex = /(?:above|over|more\s+than|>=?|min)\s+([\d.]+k?)/i;
    const minMatch = queryText.match(minRegex);
    if (minMatch) {
      intent.minPrice = parsePriceWithK(minMatch[1]);
    }

    // Around / approx / nearly
    const approxRegex = /(?:around|approx|approximately|near|nearly)\s+([\d.]+k?)/i;
    const approxMatch = queryText.match(approxRegex);
    if (approxMatch) {
      const basePrice = parsePriceWithK(approxMatch[1]);
      intent.minPrice = basePrice * 0.9;
      intent.maxPrice = basePrice * 1.1;
    }

    // Fallback: If numbers exist and no bounds are matched, set maxPrice by default (e.g. "samsung phone 20000")
    if (intent.minPrice === null && intent.maxPrice === null) {
      const genericNumberRegex = /\b(\d+k?)\b/i;
      const genericNumberMatch = queryText.match(genericNumberRegex);
      if (genericNumberMatch) {
        intent.maxPrice = parsePriceWithK(genericNumberMatch[1]);
      }
    }
  }

  // 4. Sort By Detection
  if (queryText.includes('cheapest') || queryText.includes('cheap') || queryText.includes('lowest')) {
    intent.sortBy = 'price_low';
  } else if (queryText.includes('expensive') || queryText.includes('highest price')) {
    intent.sortBy = 'price_high';
  } else if (queryText.includes('best') || queryText.includes('top') || queryText.includes('popular') || queryText.includes('highest rated')) {
    intent.sortBy = 'rating';
  }

  // 5. Keyword Extraction (excluding brands, categories, numbers and stop words)
  const stopWords = ['under', 'below', 'above', 'over', 'between', 'from', 'and', 'to', 'around', 'approx', 'near', 'ke', 'andar', 'with', 'for', 'a', 'an', 'the', 'best', 'cheapest', 'cheap', 'highest', 'top', 'rated', 'popular', 'of', 'in', 'on', 'at'];
  words.forEach(w => {
    // Clean word for evaluation
    const cleanWord = w.replace(/[^\w\d]/g, '');
    
    // Check if the word is a pricing bounds descriptor (e.g. "80000", "15k", etc.)
    const isPriceNumber = /^\d+(\.\d+)?k?$/i.test(w);

    if (
      !BRANDS.includes(w) &&
      !CATEGORIES.includes(w) &&
      !stopWords.includes(w) &&
      !isPriceNumber &&
      cleanWord.length > 1
    ) {
      intent.keywords.push(w);
    }
  });

  return intent;
};
