import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';
import { logout } from '../auth/authSlice';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/cart');
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể tải giỏ hàng'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      return {
        ...data,
        isNewProduct: data.isNewProduct // Backend sẽ trả về flag này
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật giỏ hàng'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, thunkAPI) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.delete('/cart/clear');
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể xóa giỏ hàng'
      );
    }
  }
);

export const getCartItemCount = createAsyncThunk(
  'cart/getCartItemCount',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/cart/count');
      return data.data.totalItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Không thể lấy số lượng giỏ hàng'
      );
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  addingToCart: false,
  updatingCart: false,
  badgeCount: 0, // Luôn đồng bộ với totalItems từ server
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.badgeCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.badgeCount = action.payload.totalItems; // Luôn đồng bộ
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingToCart = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.badgeCount = action.payload.totalItems; // Luôn đồng bộ
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.updatingCart = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updatingCart = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.badgeCount = action.payload.totalItems; // Luôn đồng bộ
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updatingCart = false;
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.badgeCount = action.payload.totalItems; // Luôn đồng bộ
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.badgeCount = 0; // Luôn đồng bộ
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Cart Item Count
      .addCase(getCartItemCount.fulfilled, (state, action) => {
        state.totalItems = action.payload;
        state.badgeCount = action.payload; // Luôn đồng bộ
      })

      // Reset cart when user logs out
      .addCase(logout, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.loading = false;
        state.error = null;
        state.addingToCart = false;
        state.updatingCart = false;
        state.badgeCount = 0;
      });
  },
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
