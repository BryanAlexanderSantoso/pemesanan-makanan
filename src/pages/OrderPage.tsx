import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Clock, MapPin, Package } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import Map from '../components/Map';

const OrderStatusSteps = [
  { key: 'pending', icon: Clock, label: 'Order Received' },
  { key: 'confirmed', icon: CheckCircle, label: 'Order Confirmed' },
  { key: 'preparing', icon: Package, label: 'Preparing Order' },
  { key: 'out-for-delivery', icon: Truck, label: 'Out for Delivery' },
  { key: 'delivered', icon: MapPin, label: 'Delivered' },
];

const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState(id ? getOrderById(id) : undefined);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  // Poll for order updates
  useEffect(() => {
    if (!id) return;
    
    // Initial order load
    setOrder(getOrderById(id));
    
    // Set up polling interval
    const interval = setInterval(() => {
      const updatedOrder = getOrderById(id);
      setOrder(updatedOrder);
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [id, getOrderById]);

  // Update current status index when order status changes
  useEffect(() => {
    if (order) {
      const index = OrderStatusSteps.findIndex(step => step.key === order.status);
      if (index !== -1) {
        setCurrentStatusIndex(index);
      }
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/restaurants" className="btn btn-primary">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isDelivered ? 'Order Delivered' : 'Order Status'}
          </h1>
          <p className="text-neutral-600">
            {isDelivered 
              ? `Your order from ${order.restaurantName} has been delivered.` 
              : `Your order from ${order.restaurantName} is on its way.`}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status and Map Section */}
          <div className="lg:col-span-2">
            {/* Status Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="relative">
                {/* Status Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-neutral-200">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-500" 
                    style={{ 
                      width: `${(currentStatusIndex / (OrderStatusSteps.length - 1)) * 100}%` 
                    }}
                  />
                </div>
                
                {/* Status Steps */}
                <div className="flex justify-between relative">
                  {OrderStatusSteps.map((step, idx) => {
                    const isActive = idx <= currentStatusIndex;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div 
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-400'
                          }`}
                        >
                          <StepIcon size={20} />
                        </div>
                        <span className={`text-sm font-medium mt-2 text-center ${
                          isActive ? 'text-primary-600' : 'text-neutral-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Delivery Map */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Tracking</h2>
              
              <div className="h-[300px]">
                <Map 
                  markers={[
                    // Restaurant marker
                    {
                      position: [40.7128, -74.0060], // Example coordinates
                      title: order.restaurantName,
                      type: 'restaurant'
                    },
                    // Delivery address marker
                    {
                      position: [40.7200, -74.0000], // Example coordinates
                      title: 'Delivery Address',
                      description: order.deliveryAddress,
                      type: 'user'
                    },
                    // Driver marker (if out for delivery)
                    ...(order.driverLocation ? [
                      {
                        position: order.driverLocation,
                        title: 'Delivery Driver',
                        type: 'driver'
                      }
                    ] : [])
                  ]}
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium">Delivery Details</h3>
                <p className="text-neutral-600">
                  {isDelivered 
                    ? 'Your order has been delivered.' 
                    : `Estimated delivery: ${order.estimatedDeliveryTime}`}
                </p>
                <p className="text-neutral-600 mt-1">
                  Delivery Address: {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Details Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-500">Order #{order.id.substring(6, 14)}</p>
                <p className="text-sm text-neutral-500">
                  Placed: {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div className="divide-y mb-4">
                {order.items.map(item => (
                  <div key={item.menuItem.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.quantity}x {item.menuItem.name}</p>
                      <p className="text-sm text-neutral-500">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>${(order.total - 3.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/restaurants" className="btn btn-primary w-full">
                {isDelivered ? 'Order Again' : 'Order More Food'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;