import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setFeaturedProducts, setLoading } from '../store/productSlice';
import { productService, categoryService, cartService, userService } from '../services/api';
import { setCart } from '../store/cartSlice';
import { setUser } from '../store/authSlice';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../components/Skeleton';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ChevronRight, Flame, Sparkles, Tag, Truck, ShieldCheck, Zap } from 'lucide-react';

const CATEGORY_IMAGES = {
  'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300',
  'Clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300',
  'Sports & Outdoors': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300',
  'Beauty & Health': 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300',
  'Toys & Games': 'https://images.unsplash.com/photo-1558060370-d651511a4e72?w=300',
  'Baby Products': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300',
  'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300',
  'Pet Supplies': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300',
  'Garden & Outdoors': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300',
  'Office & Stationery': 'https://images.unsplash.com/photo-1497215842964-222b4bef3739?w=300',
  'Musical Instruments': 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300',
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { featured, isLoading } = useSelector((state) => state.products);
  
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
    loadCategories();
    loadTrendingProducts();
    loadAdditionalProducts();
  }, []);

  const handleToggleWishlist = async (productId) => {
    try {
      const res = await userService.toggleWishlist(productId);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(res.message);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await cartService.addToCart(productId, 1);
      if (res.success) {
        dispatch(setCart(res.data));
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

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
      const response = await productService.getAllProducts({ sort: '-rating', limit: 5 });
      if (response.success) {
        setTrendingProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load trending products');
    } finally {
      setTrendingLoading(false);
    }
  };

  const loadAdditionalProducts = async () => {
    try {
      const [discountRes, newRes] = await Promise.all([
        productService.getAllProducts({ sort: 'price', limit: 5 }), // mock for deals
        productService.getAllProducts({ sort: '-createdAt', limit: 5 })
      ]);
      if (discountRes.success) setDiscountedProducts(discountRes.data);
      if (newRes.success) setNewArrivals(newRes.data);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* 1. Hero Banner Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            Welcome to <span className="text-primary-400">NextCart AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Experience the future of shopping. Discover personalized deals, smart recommendations, and millions of premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/products')} className="px-8 shadow-lg shadow-primary-500/30 rounded-full h-14 text-lg">
              Shop Now <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-gray-400 text-white hover:bg-white/10 rounded-full h-14 text-lg" onClick={() => navigate('/deals')}>
              View Deals <Tag className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <div className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-5 hidden sm:block shadow-sm z-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center max-w-5xl mx-auto">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wide">
              <Truck className="w-5 h-5 text-primary-500" /> Free Delivery
            </div>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-primary-500" /> Secure Payment
            </div>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wide">
              <Zap className="w-5 h-5 text-primary-500" /> Fast Shipping
            </div>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wide">
              <Tag className="w-5 h-5 text-primary-500" /> Best Deals
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-24">
        
        {/* 2. Categories Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 mt-2">Explore our wide range of collections</p>
            </div>
            <Link to="/categories" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categoriesLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 h-36 rounded-2xl animate-pulse"></div>
              ))
            ) : categories.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500">No categories found.</div>
            ) : (
              categories.slice(0, 6).map((category) => (
                <Link 
                  key={category._id} 
                  to={`/products?category=${category._id}`}
                  className="group relative h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                    <img 
                      src={category.image?.url || CATEGORY_IMAGES[category.name] || `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(category.name)}`} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(category.name)}`;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold leading-tight">{category.name}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 3. Trending Products */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                Trending Now <Flame className="w-8 h-8 text-orange-500" />
              </h2>
              <p className="text-gray-500 mt-2">Products loved by our community</p>
            </div>
            <Link to="/products?sort=-rating" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingLoading ? (
              Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : trendingProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No trending products found.</div>
            ) : (
              trendingProducts.slice(0, 5).map(product => (
                <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </section>

        {/* 4. Deals of the Day */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                Deals of the Day <Tag className="w-8 h-8 text-red-500" />
              </h2>
              <p className="text-gray-500 mt-2">Don't miss out on these amazing discounts</p>
            </div>
            <Link to="/deals" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingLoading ? (
              Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : discountedProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No deals currently available.</div>
            ) : (
              discountedProducts.slice(0, 5).map(product => (
                <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </section>
        
        {/* 5. Featured Brands */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl py-12 relative overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-48 h-48" />
          </div>
          <div className="text-center mb-10 relative z-10 px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Featured Brands</h2>
            <p className="text-gray-500 mt-2">Shop from the best brands in the world</p>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
            {/* Gradient Overlays for smooth edges */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
            
            <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex items-center gap-10 md:gap-16 px-8">
                  {['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Puma', 'Zara', 'H&M', "Levi's", 'Under Armour'].map((brand, i) => (
                    <div 
                      key={`${arrayIndex}-${i}`}
                      onClick={() => navigate(`/products?search=${brand}`)}
                      className="flex items-center justify-center min-w-[140px] h-20 px-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-2xl md:text-3xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Recently Viewed */}
        {(() => {
          const viewedStr = localStorage.getItem('recentlyViewed');
          if (!viewedStr) return null;
          try {
            const viewed = JSON.parse(viewedStr);
            if (!Array.isArray(viewed) || viewed.length === 0) return null;
            return (
              <section>
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                    Recently Viewed
                  </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {viewed.slice(0, 5).map(product => (
                    <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </section>
            );
          } catch(e) { return null; }
        })()}
        
        {/* 7. Recommended For You */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                Recommended For You <Sparkles className="w-7 h-7 text-yellow-500" />
              </h2>
              <p className="text-gray-500 mt-2">Based on your browsing history</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingLoading ? (
              Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : featured.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No recommendations found.</div>
            ) : (
              featured.slice(0, 5).map(product => (
                <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </section>

        {/* 8. New Arrivals */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                New Arrivals <Sparkles className="w-7 h-7 text-purple-500" />
              </h2>
              <p className="text-gray-500 mt-2">Check out the latest additions to our store</p>
            </div>
            <Link to="/products?sort=-createdAt" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingLoading ? (
              Array(5).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : newArrivals.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">No products found.</div>
            ) : (
              newArrivals.slice(0, 5).map(product => (
                <ProductCard key={product._id} product={product} onWishlistToggle={handleToggleWishlist} onAddToCart={handleAddToCart} />
              ))
            )}
          </div>
        </section>

        {/* 9. Newsletter Signup */}
        <section className="bg-gradient-to-r from-primary-700 to-indigo-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl mb-12">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Get 10% Off Your First Order</h2>
            <p className="text-primary-100 mb-10 text-lg md:text-xl">
              Subscribe to our newsletter to receive exclusive deals, early access to sales, and new arrivals directly in your inbox.
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                toast.info('A verification link has been sent to this email address. Please verify to confirm your subscription.', { autoClose: 5000 });
                e.target.reset();
              }}
            >
              <input type="email" placeholder="Enter your email address" required className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-500/50 shadow-inner text-lg" />
              <Button type="submit" variant="secondary" className="px-10 py-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-xl text-lg font-bold">Subscribe</Button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
