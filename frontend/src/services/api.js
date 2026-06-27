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

  let response = await fetch(url, options);

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

  // Check if response is ok, if not we still return json but it has success: false
  return response.json();
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

  addToCart: async (productId, quantity) => {
    return customFetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem: async (productId, quantity) => {
    return customFetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  removeFromCart: async (productId) => {
    return customFetch(`${API_BASE_URL}/cart/remove/${productId}`, {
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
};

export default {
  authService,
  productService,
  categoryService,
  cartService,
  orderService,
};
