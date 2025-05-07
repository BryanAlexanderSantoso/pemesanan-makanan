import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { useCart } from './CartContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (items: CartItem[], restaurantId: string, restaurantName: string, deliveryAddress: string) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateDriverLocation: (id: string, location: [number, number]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { clearCart } = useCart();

  // Load orders from localStorage on initial render
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('foodOrders');
      const savedCurrentOrder = localStorage.getItem('currentFoodOrder');
      
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      
      if (savedCurrentOrder) {
        setCurrentOrder(JSON.parse(savedCurrentOrder));
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('foodOrders', JSON.stringify(orders));
      
      if (currentOrder) {
        localStorage.setItem('currentFoodOrder', JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem('currentFoodOrder');
      }
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders, currentOrder]);

  // Simulate delivery progress for demonstration
  useEffect(() => {
    if (currentOrder && currentOrder.status !== 'delivered') {
      const statuses: Order['status'][] = ['confirmed', 'preparing', 'out-for-delivery', 'delivered'];
      const currentStatusIndex = statuses.indexOf(currentOrder.status);
      
      if (currentStatusIndex < statuses.length - 1) {
        const nextStatus = statuses[currentStatusIndex + 1];
        const delay = {
          'pending': 15000,    // 15 seconds to confirm
          'confirmed': 30000,  // 30 seconds to start preparing
          'preparing': 45000,  // 45 seconds to prepare
          'out-for-delivery': 60000  // 60 seconds to deliver
        }[currentOrder.status] || 30000;
        
        const timer = setTimeout(() => {
          updateOrderStatus(currentOrder.id, nextStatus);
          
          // If order is out for delivery, simulate driver movement
          if (nextStatus === 'out-for-delivery') {
            startDriverSimulation(currentOrder.id);
          }
          
          // If order is delivered, clear current order after a delay
          if (nextStatus === 'delivered') {
            setTimeout(() => {
              setCurrentOrder(null);
            }, 10000);
          }
        }, delay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentOrder]);

  // Simulate driver movement
  const startDriverSimulation = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Start driver at restaurant location
    const restaurant = order.restaurantId;
    const restaurantLat = 40.7128; // Example coordinates
    const restaurantLng = -74.0060;
    
    updateDriverLocation(orderId, [restaurantLat, restaurantLng]);
    
    // Update driver location every 10 seconds
    const interval = setInterval(() => {
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder || currentOrder.status === 'delivered') {
        clearInterval(interval);
        return;
      }
      
      if (currentOrder.driverLocation) {
        // Move driver closer to destination
        const [driverLat, driverLng] = currentOrder.driverLocation;
        const destinationLat = 40.7200; // Example destination
        const destinationLng = -74.0000;
        
        // Calculate new position (moving 20% closer each time)
        const newLat = driverLat + (destinationLat - driverLat) * 0.2;
        const newLng = driverLng + (destinationLng - driverLng) * 0.2;
        
        updateDriverLocation(orderId, [newLat, newLng]);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  };

  const createOrder = (
    items: CartItem[],
    restaurantId: string,
    restaurantName: string,
    deliveryAddress: string
  ): Order => {
    const total = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0) + 3.99; // Add delivery fee
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...items],
      restaurantId,
      restaurantName,
      status: 'pending',
      total,
      deliveryAddress,
      timestamp: new Date().toISOString(),
      estimatedDeliveryTime: '45-55 min',
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCurrentOrder(newOrder);
    clearCart();
    
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
    
    if (currentOrder?.id === id) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const updateDriverLocation = (id: string, location: [number, number]) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, driverLocation: location } : order
      )
    );
    
    if (currentOrder?.id === id) {
      setCurrentOrder(prev => prev ? { ...prev, driverLocation: location } : null);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      createOrder,
      getOrderById,
      updateOrderStatus,
      updateDriverLocation
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};