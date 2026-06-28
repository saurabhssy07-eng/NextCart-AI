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
    const { productId, quantity, variantId, selectedOptions } = req.body;

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

    let targetStock = product.stock;
    let targetPrice = product.price;
    let targetDiscountPrice = product.discountPrice || 0;

    // Validate variant if provided
    if (variantId) {
      const variant = product.variants?.id(variantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found on this product',
        });
      }
      if (variant.status === 'draft') {
        return res.status(400).json({
          success: false,
          message: 'This variant is not currently available',
        });
      }
      targetStock = variant.stock;
      targetPrice = variant.compareAtPrice || variant.price;
      targetDiscountPrice = variant.price;
    } else if (product.variants && product.variants.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select a variant for this product',
      });
    }

    // Check stock
    if (targetStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${targetStock} items available`,
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if exact product + variant already in cart
    const existingItem = cart.items.find((item) => 
      item.product.toString() === productId && 
      (item.variantId ? item.variantId.toString() === variantId : !variantId)
    );

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
      existingItem.quantity += quantity;
    } else {
      if (quantity > maxOrderQty) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxOrderQty} items allowed per order for this product`,
        });
      }
      cart.items.push({
        product: productId,
        variantId: variantId || undefined,
        selectedOptions: selectedOptions || undefined,
        quantity,
        price: targetPrice,
        discountPrice: targetDiscountPrice,
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
    const { productId, variantId, quantity } = req.body;

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

    let targetStock = product.stock;
    if (variantId) {
      const variant = product.variants?.id(variantId);
      if (!variant) {
        return res.status(404).json({ success: false, message: 'Variant not found' });
      }
      targetStock = variant.stock;
    }

    if (targetStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${targetStock} items available`,
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const cartItem = cart.items.find((item) => 
      item.product.toString() === productId && 
      (item.variantId ? item.variantId.toString() === variantId : !variantId)
    );

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
    // To support variants, we accept variantId in the query string or body, but since it's a DELETE request usually it's in params.
    // We will support a new generic delete that takes an itemId (the cart subdoc ID), but for backward compatibility:
    const { productId } = req.params;
    const { variantId } = req.query; // If frontend passes ?variantId=...

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

    cart.items = cart.items.filter((item) => {
      const isProductMatch = item.product.toString() === productId;
      if (!isProductMatch) return true; // Keep it
      
      // If it's a product match, check if variant matches what we want to delete
      if (variantId) {
        return item.variantId?.toString() !== variantId; // Remove if variant matches
      } else {
        // If no variantId provided to delete, remove all instances of this product (legacy behavior)
        return false;
      }
    });

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
