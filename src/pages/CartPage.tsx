import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useLocation } from '../context/LocationContext';

const CartPage: React.FC = () => {
  const { items, removeItem, updateItemQuantity, subtotal, deliveryFee, total, restaurant, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { userLocation } = useLocation();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(userLocation?.address || '');
  
  const handleCheckout = () => {
    if (!restaurant) {
      alert('No items in cart');
      return;
    }
    
    if (!deliveryAddress) {
      alert('Please enter a delivery address');
      return;
    }
    
    const order = createOrder(
      items,
      restaurant.id,
      restaurant.name,
      deliveryAddress
    );
    
    navigate(`/order/${order.id}`);
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={24} className="text-neutral-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/restaurants" className="btn btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Items from {restaurant?.name}</h2>
                <button 
                  className="text-neutral-500 hover:text-error-500 flex items-center"
                  onClick={clearCart}
                >
                  <Trash size={16} className="mr-1" />
                  <span className="text-sm">Clear Cart</span>
                </button>
              </div>
              
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.menuItem.id} className="py-4 flex">
                    <img 
                      src={item.menuItem.image} 
                      alt={item.menuItem.name} 
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.menuItem.name}</h3>
                        <p className="font-medium">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <p className="text-sm text-neutral-500 mb-2">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                            onClick={() => updateItemQuantity(item.menuItem.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                            onClick={() => updateItemQuantity(item.menuItem.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          className="text-neutral-500 hover:text-error-500"
                          onClick={() => removeItem(item.menuItem.id)}
                          aria-label="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="input"
                  placeholder="Enter your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              
              <button 
                className="btn btn-primary w-full mb-3"
                onClick={handleCheckout}
              >
                Checkout
              </button>
              
              <Link to="/restaurants" className="text-center block text-sm text-primary-600 hover:text-primary-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;