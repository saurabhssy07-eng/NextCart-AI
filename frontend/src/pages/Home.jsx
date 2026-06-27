import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setFeaturedProducts, setLoading } from '../store/productSlice';
import { setCart } from '../store/cartSlice';
import { productService, categoryService, cartService } from '../services/api';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../components/Skeleton';

const CATEGORY_IMAGES = {
  'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300',
  'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300',
  'Sports & Outdoors': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300',
  'Beauty & Health': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300',
  'Toys & Games': 'https://images.unsplash.com/photo-1558060370-d651511a4e72?w=300',
  'Baby Products': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300',
  'Automotive': 'https://images.unsplash.com/photo-1449966368868-9f1af1ab77d0?w=300',
  'Pet Supplies': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300',
  'Garden & Outdoors': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300',
  'Office & Stationery': 'https://images.unsplash.com/photo-1497215842964-222b4bef3739?w=300',
  'Musical Instruments': 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300',
};

const Home = () => {
  const dispatch = useDispatch();
  const { featured, isLoading } = useSelector((state) => state.products);
  const { accessToken } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState({});
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
    loadCategories();
    loadTrendingProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await productService.getFeaturedProducts();
      if (response.success) {
        dispatch(setFeaturedProducts(response.data));
      }
    } catch (error) {
      toast.error('Failed to load featured products');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadTrendingProducts = async () => {
    setTrendingLoading(true);
    try {
      const response = await productService.getAllProducts({ sort: '-rating', limit: 8 });
      if (response.success) {
        setTrendingProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load trending products');
    } finally {
      setTrendingLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!accessToken) {
      toast.error('Please login to add items to cart');
      return;
    }

    const qty = quantity[productId] || 1;

    try {
      const response = await cartService.addToCart(productId, qty, accessToken);
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Added to cart!');
        setQuantity((prev) => ({ ...prev, [productId]: 1 }));
      } else {
        toast.error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-yellow-300">NextCart AI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Your AI-powered shopping destination for quality products
            with the best prices, fast delivery, and easy returns.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              🛍️ Shop Now
            </Link>
            <Link
              to="/products?sort=-rating"
              className="inline-block bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 shadow-lg hover:shadow-xl transition-all"
            >
              🔥 Trending
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🏷️ Shop by Category
          </h2>
          <Link
            to="/products"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={cat.image || CATEGORY_IMAGES[cat.name] || 'https://via.placeholder.com/300'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Categories loading...
          </p>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              ⭐ Featured Products
            </h2>
            <Link
              to="/products"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product) => (
                <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group">
                  <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discountPrice > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        🏷️ SALE
                      </span>
                    )}
                  </Link>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                      {product.category?.name}
                    </div>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                        </span>
                        {product.discountPrice > 0 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded text-xs font-medium">
                        ⭐ {product.rating}/5
                      </span>
                    </div>

                    {product.stock > 0 ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity[product._id] || 1}
                          onChange={(e) =>
                            setQuantity((prev) => ({
                              ...prev,
                              [product._id]: Math.max(1, parseInt(e.target.value) || 1),
                            }))
                          }
                          className="w-14 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-center text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm font-medium text-center">Out of Stock</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔥 Trending Products
          </h2>
          <Link
            to="/products?sort=-rating"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        {trendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group">
                <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.rating >= 4.5 && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-bold">
                      🔥 TOP
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    {product.category?.name}
                  </div>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                      </span>
                      {product.discountPrice > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        ⭐ {product.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        {product.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Why Choose NextCart AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🇮🇳', title: 'Made for India', desc: 'Localized shopping with Indian payment options, PIN codes, and regional support' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Free delivery on all orders above ₹499 with fast and reliable shipping across India' },
              { icon: '💯', title: 'Quality Products', desc: 'Curated selection of high-quality items from trusted brands and sellers' },
              { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations and personalized shopping experience' },
              { icon: '🔒', title: 'Secure Payments', desc: '100% secure payments with UPI, cards, net banking, and COD options' },
              { icon: '🔄', title: 'Easy Returns', desc: 'Hassle-free returns and exchanges within 7 days of delivery' },
              { icon: '📞', title: '24/7 Support', desc: 'Round-the-clock customer support for all your queries' },
              { icon: '🎯', title: 'Best Prices', desc: 'Competitive prices with regular deals, discounts, and offers' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
