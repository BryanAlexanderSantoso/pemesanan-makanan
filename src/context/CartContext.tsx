import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Restaurant } from '../types';
import { restaurants } from '../data/restaurants';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurant: Restaurant | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = restaurant ? parseFloat(restaurant.deliveryFee.replace('$', '')) : 0;
  const total = subtotal + deliveryFee;

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodCart');
      const savedRestaurantId = localStorage.getItem('foodCartRestaurant');
      
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      
      if (savedRestaurantId) {
        const foundRestaurant = restaurants.find(r => r.id === savedRestaurantId);
        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('foodCart', JSON.stringify(items));
      if (restaurant) {
        localStorage.setItem('foodCartRestaurant', restaurant.id);
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, restaurant]);

  const addItem = (item: MenuItem, quantity = 1) => {
    // Check if adding from a different restaurant
    if (items.length > 0 && items[0].menuItem.restaurantId !== item.restaurantId) {
      if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return;
      }
      setItems([]);
    }

    // Set the restaurant if it's the first item
    if (items.length === 0 || items[0].menuItem.restaurantId !== item.restaurantId) {
      const newRestaurant = restaurants.find(r => r.id === item.restaurantId) || null;
      setRestaurant(newRestaurant);
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.menuItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(i => 
          i.menuItem.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        // Add new item
        return [...prevItems, { menuItem: item, quantity }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.menuItem.id !== itemId));
    
    // If no items left, reset restaurant
    if (items.length <= 1) {
      setRestaurant(null);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(i => 
        i.menuItem.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    localStorage.removeItem('foodCart');
    localStorage.removeItem('foodCartRestaurant');
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      totalItems,
      subtotal,
      deliveryFee,
      total,
      restaurant
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};