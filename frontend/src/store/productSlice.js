import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featured: [],
  currentProduct: null,
  categories: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products || [];
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    },
    setFeaturedProducts: (state, action) => {
      state.featured = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setCategories,
  setLoading,
  setError,
  clearError,
  addProduct,
  updateProduct,
  deleteProduct,
} = productSlice.actions;

export default productSlice.reducer;
