const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Custom fetch wrapper to handle HttpOnly cookies and 401 Refresh Token logic
const customFetch = async (url, options = {}) => {
  options.credentials = 'include'; // Ensures HttpOnly cookies are sent
  options.headers = { ...getHeaders(), ...options.headers };

  let response;
  try {
    response = await fetch(url, options);
    window.dispatchEvent(new Event('backend:reachable'));
  } catch (err) {
    if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
      window.dispatchEvent(new Event('backend:unreachable'));
      throw new Error('Network error: Cannot reach server');
    }
    throw err;
  }

  // If unauthorized (and not trying to login/refresh), attempt refresh
  if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh-token')) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include'
      });
      
      if (refreshRes.ok) {
        // Retry the original request
        response = await fetch(url, options);
      } else {
        // Dispatch event so Redux can log the user out
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    } catch (err) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  const data = await response.json();
  if (!response.ok && data.errors && data.errors.length > 0) {
    // If multiple errors, we just show the first one in the toast by default
    // Components can use data.errors to highlight fields
    data.message = data.errors[0].message;
  }
  return data;
};

// ============= AUTH SERVICES =============
export const authService = {
  register: async (userData) => {
    return customFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return customFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  googleLogin: async (idToken) => {
    return customFetch(`${API_BASE_URL}/auth/google-login`, {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  logout: async () => {
    return customFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
  },

  refreshToken: async () => {
    return customFetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return customFetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
    });
  },

  forgotPassword: async (email) => {
    return customFetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password) => {
    return customFetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    });
  },

  verifyEmail: async (token) => {
    return customFetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: 'GET',
    });
  },

  resendVerification: async (email) => {
    return customFetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
};

// ============= PRODUCT SERVICES =============
export const productService = {
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return customFetch(`${API_BASE_URL}/products?${queryString}`);
  },

  getProductById: async (id) => {
    return customFetch(`${API_BASE_URL}/products/${id}`);
  },

  getFeaturedProducts: async () => {
    return customFetch(`${API_BASE_URL}/products/featured`);
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return customFetch(`${API_BASE_URL}/products/category/${categoryId}?${queryString}`);
  },

  createProduct: async (productData) => {
    return customFetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return customFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return customFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============= CATEGORY SERVICES =============
export const categoryService = {
  getAllCategories: async () => {
    return customFetch(`${API_BASE_URL}/categories`);
  },

  getCategoryById: async (id) => {
    return customFetch(`${API_BASE_URL}/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return customFetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (id, categoryData) => {
    return customFetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (id) => {
    return customFetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============= CART SERVICES =============
export const cartService = {
  getCart: async () => {
    return customFetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
    });
  },

  addToCart: async (productId, quantity, variantId = null, selectedOptions = null) => {
    return customFetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId, selectedOptions }),
    });
  },

  updateCartItem: async (productId, quantity, variantId = null) => {
    return customFetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity, variantId }),
    });
  },

  removeFromCart: async (productId, variantId = null) => {
    const query = variantId ? `?variantId=${variantId}` : '';
    return customFetch(`${API_BASE_URL}/cart/remove/${productId}${query}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return customFetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
    });
  },

  applyCoupon: async (couponCode, discount) => {
    return customFetch(`${API_BASE_URL}/cart/apply-coupon`, {
      method: 'POST',
      body: JSON.stringify({ couponCode, discount }),
    });
  },
};

// ============= ORDER SERVICES =============
export const orderService = {
  createOrder: async (orderData) => {
    return customFetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return customFetch(`${API_BASE_URL}/orders?${queryString}`, {
      method: 'GET',
    });
  },

  getOrderById: async (id) => {
    return customFetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
    });
  },

  cancelOrder: async (id) => {
    return customFetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },

  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return customFetch(`${API_BASE_URL}/orders/admin/all?${queryString}`, {
      method: 'GET',
    });
  },

  updateOrderStatus: async (id, statusData) => {
    return customFetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  downloadInvoice: async (id, accessToken) => {
    const headers = {
      'Content-Type': 'application/pdf',
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/orders/${id}/invoice`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return await response.blob();
  },
};

// ============= REVIEW SERVICES =============
export const reviewService = {
  // Get reviews for a product with pagination, sorting, and filtering
  getProductReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return customFetch(`${API_BASE_URL}/reviews/${productId}?${queryString}`, {
      method: 'GET',
    });
  },

  // Create a new review (handles FormData for images)
  createReview: async (productId, formData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${productId}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.errors && data.errors.length > 0) {
        data.message = data.errors[0].message;
      }
      throw data;
    }
    return data;
  },

  // Update a review
  updateReview: async (reviewId, formData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.errors && data.errors.length > 0) {
        data.message = data.errors[0].message;
      }
      throw data;
    }
    return data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    return customFetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Vote on a review (helpful, not_helpful, spam)
  voteReview: async (reviewId, value) => {
    return customFetch(`${API_BASE_URL}/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  }
};

// ============= USER SERVICES =============
export const userService = {
  updateProfile: async (profileData) => {
    return customFetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  uploadAvatar: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  },

  deleteAvatar: async () => {
    return customFetch(`${API_BASE_URL}/users/profile/avatar`, {
      method: 'DELETE',
    });
  },

  addAddress: async (addressData) => {
    return customFetch(`${API_BASE_URL}/users/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id, addressData) => {
    return customFetch(`${API_BASE_URL}/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id) => {
    return customFetch(`${API_BASE_URL}/users/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  setDefaultAddress: async (id, type) => {
    return customFetch(`${API_BASE_URL}/users/addresses/${id}/default`, {
      method: 'PUT',
      body: JSON.stringify({ type }), // 'billing' or 'shipping'
    });
  },

  toggleWishlist: async (productId) => {
    return customFetch(`${API_BASE_URL}/users/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  getWishlist: async () => {
    return customFetch(`${API_BASE_URL}/users/wishlist`, {
      method: 'GET',
    });
  },
};

// ============= PAYMENT SERVICES =============
export const paymentService = {
  verifyPayment: async (orderId, paymentData) => {
    return customFetch(`${API_BASE_URL}/payments/orders/${orderId}/verify`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  retryPayment: async (orderId) => {
    return customFetch(`${API_BASE_URL}/payments/orders/${orderId}/retry`, {
      method: 'POST',
    });
  },
};

export default {
  authService,
  productService,
  categoryService,
  cartService,
  orderService,
  userService,
  reviewService,
  paymentService,
};
