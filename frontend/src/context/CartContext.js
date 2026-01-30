import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Action types
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  CLEAR_BRAND: 'CLEAR_BRAND',
};

// Helper to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Helper to parse price
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  if (typeof priceStr === 'number') return priceStr;
  const numStr = priceStr.toString().replace(/[^0-9.]/g, '');
  return parseFloat(numStr) || 0;
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART: {
      const totals = calculateTotals(action.payload);
      return { ...state, items: action.payload, ...totals };
    }

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity, size, color } = action.payload;
      const productId = product._id.toString();
      
      // Check if item already exists
      const existingIndex = state.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      let newItems;
      if (existingIndex > -1) {
        // Update quantity
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          productId,
          product,
          quantity,
          size,
          color,
          numericPrice: product.numericPrice || parsePrice(product.price),
          brandCollection: product.brandCollection || product.brand,
        };
        newItems = [...state.items, newItem];
      }

      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, size, color, quantity } = action.payload;
      
      let newItems;
      if (quantity <= 0) {
        newItems = state.items.filter(
          item => !(item.productId === productId && item.size === size && item.color === color)
        );
      } else {
        newItems = state.items.map(item =>
          item.productId === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );
      }

      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId, size, color } = action.payload;
      const newItems = state.items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      );
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return { ...initialState };
    }

    case CART_ACTIONS.CLEAR_BRAND: {
      const { brandName } = action.payload;
      const newItems = state.items.filter(
        item => item.brandCollection !== brandName
      );
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    default:
      return state;
  }
};

// Create context
const CartContext = createContext(null);

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fashionhive_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.SET_CART, payload: items });
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fashionhive_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart
  const addToCart = (product, quantity = 1, size, color = '') => {
    if (!size) {
      return { success: false, message: 'Please select a size' };
    }
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity, size, color }
    });
    return { success: true, message: 'Item added to cart' };
  };

  // Update item quantity
  const updateQuantity = (productId, size, quantity, color = '') => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, size, color, quantity }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, size, color = '') => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId, size, color }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Clear items for a specific brand
  const clearBrand = (brandName) => {
    dispatch({
      type: CART_ACTIONS.CLEAR_BRAND,
      payload: { brandName }
    });
  };

  // Get items grouped by brand
  const getGroupedItems = () => {
    const grouped = {};
    state.items.forEach(item => {
      const brand = item.brandCollection || 'Other';
      if (!grouped[brand]) {
        grouped[brand] = [];
      }
      grouped[brand].push(item);
    });
    return grouped;
  };

  // Get total for a specific brand
  const getBrandTotal = (brandName) => {
    return state.items
      .filter(item => item.brandCollection === brandName)
      .reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
  };

  // Context value
  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearBrand,
    getGroupedItems,
    getBrandTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
