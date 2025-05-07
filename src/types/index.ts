export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  total: number;
  deliveryAddress: string;
  timestamp: string;
  estimatedDeliveryTime: string;
  driverLocation?: [number, number];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}