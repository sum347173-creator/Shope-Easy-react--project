import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload.id || action.payload._id;
      const existing = state.items.find(i => (i.id || i._id) === itemId);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, id: itemId, quantity: action.payload.quantity || 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => (i.id || i._id) !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    // ✅ updateQuantity added
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => (i.id || i._id) === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
