import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentProduct, setLoading } from '../store/productSlice';
import { setCart } from '../store/cartSlice';
import { productService, cartService } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, isLoading } = useSelector((state) => state.products);
  const { accessToken } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    dispatch(setLoading(true));
    try {
      const response = await productService.getProductById(id);
      if (response.success) {
        dispatch(setCurrentProduct(response.data));
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartService.addToCart(id, quantity, accessToken);
      if (response.success) {
        dispatch(setCart(response.data));
        toast.success('Added to cart!');
      } else {
        toast.error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!currentProduct) {
    return <div className="container mx-auto px-4 py-12 text-center">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{currentProduct.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">⭐ {currentProduct.rating}/5</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">({currentProduct.reviews} reviews)</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{currentProduct.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{(currentProduct.discountPrice || currentProduct.price).toLocaleString('en-IN')}</span>
            {currentProduct.discountPrice > 0 && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through ml-4">
                ₹{currentProduct.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              {currentProduct.stock > 0
                ? `In Stock (${currentProduct.stock} available)`
                : 'Out of Stock'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Max order: {currentProduct.maxOrderQuantity || 5} items per order
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="number"
              min="1"
              max={Math.min(currentProduct.stock, currentProduct.maxOrderQuantity || 5)}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <strong>SKU:</strong> {currentProduct.sku}
              </li>
              <li>
                <strong>Category:</strong> {currentProduct.category?.name}
              </li>
                    {currentProduct.brand && (
                      <li>
                        <strong>Brand:</strong> {currentProduct.brand}
                      </li>
                    )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
