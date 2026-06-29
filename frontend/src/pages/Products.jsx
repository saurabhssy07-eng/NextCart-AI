import { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService, categoryService, cartService, userService } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '../store/cartSlice';
import { setUser } from '../store/authSlice';
import { Filter, X, ChevronDown, Check, SearchX } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useTheme } from '../context/ThemeContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const location = useLocation();
  const isDealsPage = location.pathname === '/deals';

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: isDealsPage ? '-discountPrice' : (searchParams.get('sort') || '-createdAt'),
    page: parseInt(searchParams.get('page')) || 1,
  });

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  // Sync filters with URL changes
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sort: location.pathname === '/deals' ? '-discountPrice' : (searchParams.get('sort') || '-createdAt'),
      page: parseInt(searchParams.get('page')) || 1,
    });
  }, [location.pathname, searchParams]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params = { page: filters.page, limit: 12, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;

      const response = await productService.getAllProducts(params);
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: key === 'page' ? value : 1 };
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.page > 1) params.set('page', newFilters.page);
    setSearchParams(params);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    const qty = quantities[productId] || 1;
    try {
      const response = await cartService.addToCart(productId, qty);
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Added to cart!');
        setQuantities((prev) => ({ ...prev, [productId]: 1 }));
      } else {
        toast.error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (productId, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    
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

  const getPageHeader = () => {
    if (isDealsPage) {
      return { title: 'Deals of the Day', subtitle: 'Amazing discounts on top products' };
    }
    if (filters.sort === '-rating') {
      return { title: 'Trending Products', subtitle: 'Highly rated by our community' };
    }
    if (filters.sort === '-createdAt') {
      return { title: 'New Arrivals', subtitle: 'The latest additions to our store' };
    }
    if (filters.category) {
      const cat = categories.find(c => c._id === filters.category);
      if (cat) return { title: cat.name, subtitle: `Explore ${cat.name} products` };
    }
    if (filters.search) {
      return { title: 'Search Results', subtitle: `Showing results for "${filters.search}"` };
    }
    return { title: 'All Products', subtitle: 'Explore our complete collection' };
  };

  const headerInfo = getPageHeader();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{headerInfo.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{headerInfo.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating">Top Rated</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 max-w-2xl mx-auto">
          <EmptyState 
            icon={SearchX} 
            title="No products found" 
            description={filters.search ? `No results found for "${filters.search}". Try another keyword.` : "We couldn't find any products matching your filters."}
            actionLabel="Clear Filters"
            onAction={() => setFilters({ search: '', category: '', sort: '-createdAt', page: 1 })}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onWishlistToggle={handleToggleWishlist}
                onAddToCart={() => handleAddToCart(product._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-4 py-2 border rounded text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handleFilterChange('page', p)}
                  className={`px-4 py-2 border rounded ${
                    filters.page === p
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page >= pagination.pages}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
