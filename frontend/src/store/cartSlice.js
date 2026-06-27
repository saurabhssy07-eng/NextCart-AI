import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  totalDiscount: 0,
  finalPrice: 0,
  couponCode: null,
  couponDiscount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { items, totalPrice, totalDiscount, finalPrice, couponCode, couponDiscount } =
        action.payload;
      state.items = items || [];
      state.totalPrice = totalPrice || 0;
      state.totalDiscount = totalDiscount || 0;
      state.finalPrice = finalPrice || 0;
      state.couponCode = couponCode || null;
      state.couponDiscount = couponDiscount || 0;
    },
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.product._id === item.product._id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalDiscount = 0;
      state.finalPrice = 0;
      state.couponCode = null;
      state.couponDiscount = 0;
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
    setCoupon: (state, action) => {
      const { couponCode, couponDiscount } = action.payload;
      state.couponCode = couponCode;
      state.couponDiscount = couponDiscount;
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  setLoading,
  setError,
  clearError,
  setCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
