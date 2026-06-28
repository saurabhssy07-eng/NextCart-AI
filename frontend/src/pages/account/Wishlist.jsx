import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react';
import { userService, cartService } from '../../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import ProductCard from '../../components/product/ProductCard';
import EmptyState from '../../components/ui/EmptyState';
import SectionHeader from '../../components/ui/SectionHeader';
import { ProductCardSkeleton } from '../../components/ui/LoadingSkeleton';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await userService.getWishlist();
      if (res.success) {
        setWishlist(res.wishlist || []);
      }
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await userService.toggleWishlist(productId);
      if (res.success) {
        setWishlist(res.wishlist);
        dispatch(setUser(res.user));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (product) => {
    // If product has variants, we must redirect to the product page
    // so the user can select their variant (Color, Size, etc.)
    if (product.variants && product.variants.length > 0) {
      toast.info('Please select your preferred options first');
      navigate(`/products/${product._id}`);
      return;
    }

    try {
      const cartRes = await cartService.addToCart(product._id, 1);
      if (cartRes.success) {
        const wishRes = await userService.toggleWishlist(product._id);
        if (wishRes.success) {
          setWishlist(wishRes.wishlist);
          dispatch(setUser(wishRes.user));
        }
        toast.success('Item moved to cart');
      } else {
        toast.error(cartRes.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to move item to cart');
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="My Wishlist" 
        subtitle={`${wishlist.length} items saved`}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love and buy them later."
          actionLabel="Continue Shopping"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {wishlist.map((item) => (
            <ProductCard 
              key={item._id} 
              product={item} 
              compact={true}
              showWishlist={true}
              showAddToCart={false}
              showQuickView={false}
              showCompare={false}
              showMoveToCart={true}
              onWishlistToggle={handleRemove}
              onMoveToCart={() => handleMoveToCart(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
