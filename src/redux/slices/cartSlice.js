import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store cart items
  totalQuantity: 0, // Total quantity of all items in the cart
  totalPrice: 0, // Total price of all items in the cart
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addItemToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id && item.type === newItem.type);

      if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice += newItem.price * newItem.quantity;
      } else {
        // Add new item to cart
        state.items.push({
          ...newItem,
          quantity: newItem.quantity,
          totalPrice: newItem.price * newItem.quantity,
        });
      }

      // Update total cart quantity and price
      state.totalQuantity += newItem.quantity;
      state.totalPrice += newItem.price * newItem.quantity;
    },

    // Remove item from cart
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.totalPrice;
        state.items = state.items.filter(item => item.id !== id);
      }
    },

    // Update item quantity in cart
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        // Adjust total cart quantity and price
        state.totalQuantity += quantity - existingItem.quantity;
        state.totalPrice += (quantity * existingItem.price) - existingItem.totalPrice;

        // Update item quantity and total price
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      }
    },

    // Clear all items from cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
