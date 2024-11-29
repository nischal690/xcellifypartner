import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import languageReducer from './slices/languageSlice'
import cartReducer from './slices/cartSlice'
import { loadState, saveState } from '../utils/localStorage';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    language:languageReducer,
    cart:cartReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});
