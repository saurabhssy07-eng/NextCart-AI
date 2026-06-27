import { Cart, Product } from '../models/index.js';

// GET user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('❌ Get cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

// ADD item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    // Check quantity limits
    const maxOrderQty = product.maxOrderQuantity || 5;
    let totalQty = quantity;
    
    if (existingItem) {
      totalQty += existingItem.quantity;
      if (totalQty > maxOrderQty) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxOrderQty} items allowed per order for this product`,
        });
      }
    } else {
      if (quantity > maxOrderQty) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxOrderQty} items allowed per order for this product`,
        });
      }
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discountPrice: product.discountPrice || 0,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('❌ Add to cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message,
    });
  }
};

// UPDATE cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const cartItem = cart.items.find((item) => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart',
      });
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart,
    });
  } catch (error) {
    console.error('❌ Update cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message,
    });
  }
};

// REMOVE item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('❌ Remove from cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

// CLEAR cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.totalDiscount = 0;
    cart.finalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    console.error('❌ Clear cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message,
    });
  }
};

// APPLY coupon code
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, discount } = req.body;

    if (!couponCode || discount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and discount are required',
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.couponCode = couponCode;
    cart.couponDiscount = discount;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: cart,
    });
  } catch (error) {
    console.error('❌ Apply coupon error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error applying coupon',
      error: error.message,
    });
  }
};
