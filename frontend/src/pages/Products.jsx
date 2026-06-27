import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService, categoryService, cartService } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '../store/cartSlice';
import { ProductCardSkeleton } from '../components/Skeleton';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

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
    if (!accessToken) {
      toast.error('Please login to add items to cart');
      return;
    }

    const qty = quantities[productId] || 1;
    try {
      const response = await cartService.addToCart(productId, qty, accessToken);
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">All Products</h1>

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
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No products found</p>
          <button
            onClick={() => setFilters({ search: '', category: '', sort: '-createdAt', page: 1 })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    {product.category?.name}
                  </div>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate hover:text-blue-600">
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
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⭐ {product.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Max: {product.maxOrderQuantity || 5}
                      </span>
                    </div>
                  </div>

                  {product.stock > 0 ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={Math.min(product.stock, product.maxOrderQuantity || 5)}
                        value={quantities[product._id] || 1}
                        onChange={(e) =>
                          setQuantities((prev) => ({
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
