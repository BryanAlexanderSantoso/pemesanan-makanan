import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock size={16} className="text-neutral-500" />;
    case 'confirmed':
      return <CheckCircle size={16} className="text-primary-500" />;
    case 'preparing':
      return <Package size={16} className="text-primary-500" />;
    case 'out-for-delivery':
      return <Truck size={16} className="text-primary-500" />;
    case 'delivered':
      return <CheckCircle size={16} className="text-accent-500" />;
    default:
      return <Clock size={16} />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Order Received';
    case 'confirmed':
      return 'Order Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'out-for-delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
};

const OrdersPage: React.FC = () => {
  const { orders } = useOrder();
  
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (sortedOrders.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={24} className="text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-neutral-600 mb-6">
              You haven't placed any orders yet. Start by exploring restaurants near you.
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
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {sortedOrders.map(order => (
              <Link 
                key={order.id} 
                to={`/order/${order.id}`}
                className="p-4 hover:bg-neutral-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{order.restaurantName}</h3>
                    <p className="text-sm text-neutral-500">
                      {new Date(order.timestamp).toLocaleDateString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {getStatusIcon(order.status)}
                      <span className="ml-1 text-sm font-medium">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-neutral-600">
                  {order.items.slice(0, 2).map((item, index) => (
                    <span key={item.menuItem.id}>
                      {index > 0 && ', '}
                      {item.quantity}x {item.menuItem.name}
                    </span>
                  ))}
                  {order.items.length > 2 && `, +${order.items.length - 2} more`}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;