const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// ============= AUTH SERVICES =============
export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  refreshToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return response.json();
  },
};

// ============= PRODUCT SERVICES =============
export const productService = {
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    return response.json();
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  getFeaturedProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/featured`);
    return response.json();
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}?${queryString}`);
    return response.json();
  },

  createProduct: async (productData, token) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  updateProduct: async (id, productData, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  deleteProduct: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.json();
  },
};

// ============= CATEGORY SERVICES =============
export const categoryService = {
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  getCategoryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return response.json();
  },

  createCategory: async (categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  updateCategory: async (id, categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  deleteCategory: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.json();
  },
};

// ============= CART SERVICES =============
export const cartService = {
  getCart: async (token) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return response.json();
  },

  addToCart: async (productId, quantity, token) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  updateCartItem: async (productId, quantity, token) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  removeFromCart: async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.json();
  },

  clearCart: async (token) => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return response.json();
  },

  applyCoupon: async (couponCode, discount, token) => {
    const response = await fetch(`${API_BASE_URL}/cart/apply-coupon`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ couponCode, discount }),
    });
    return response.json();
  },
};

// ============= ORDER SERVICES =============
export const orderService = {
  createOrder: async (orderData, token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  getUserOrders: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return response.json();
  },

  getOrderById: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return response.json();
  },

  cancelOrder: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(token),
    });
    return response.json();
  },

  getAllOrders: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders/admin/all?${queryString}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return response.json();
  },

  updateOrderStatus: async (id, statusData, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(statusData),
    });
    return response.json();
  },
};

export default {
  authService,
  productService,
  categoryService,
  cartService,
  orderService,
};
