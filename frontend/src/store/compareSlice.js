import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const loadCompareList = () => {
  try {
    const serialized = localStorage.getItem('compareList');
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (e) {
    console.error('Could not load compare list from local storage', e);
  }
  return [];
};

const saveCompareList = (state) => {
  try {
    const serialized = JSON.stringify(state.items);
    localStorage.setItem('compareList', serialized);
  } catch (e) {
    console.error('Could not save compare list to local storage', e);
  }
};

const initialState = {
  items: loadCompareList(), // Array of full product objects
  isDrawerOpen: false,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item._id === product._id);
      
      if (exists) {
        state.items = state.items.filter(item => item._id !== product._id);
        toast.info('Removed from compare');
      } else {
        if (state.items.length >= 4) {
          toast.warning('You can only compare up to 4 items');
          return;
        }
        state.items.push(product);
        toast.success('Added to compare');
      }
      saveCompareList(state);
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveCompareList(state);
    },
    clearCompare: (state) => {
      state.items = [];
      saveCompareList(state);
    },
    toggleCompareDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setCompareDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    }
  },
});

export const { toggleCompare, removeFromCompare, clearCompare, toggleCompareDrawer, setCompareDrawerOpen } = compareSlice.actions;
export default compareSlice.reducer;
