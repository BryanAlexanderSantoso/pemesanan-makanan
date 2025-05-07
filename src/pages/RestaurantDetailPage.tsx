import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, DollarSign, MapPin, ChevronLeft } from 'lucide-react';
import { restaurants, menuItems } from '../data/restaurants';
import MenuItem from '../components/MenuItem';
import Map from '../components/Map';
import { Restaurant, MenuItem as MenuItemType } from '../types';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItemType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const foundRestaurant = restaurants.find(r => r.id === id) || null;
      setRestaurant(foundRestaurant);
      
      const restaurantMenu = menuItems[id] || [];
      setMenu(restaurantMenu);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(restaurantMenu.map(item => item.category)));
      setCategories(uniqueCategories);
      
      // Set first category as active by default
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Restaurant not found</p>
          <Link to="/restaurants" className="btn btn-primary mt-4">
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-neutral-50">
      {/* Hero Background */}
      <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.image})` }}>
        <div className="container mx-auto px-4 h-full relative">
          <Link 
            to="/restaurants" 
            className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
          >
            <ChevronLeft size={24} />
          </Link>
        </div>
      </div>
      
      {/* Restaurant Info Card */}
      <div className="container mx-auto px-4 -mt-16 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-neutral-600 mb-4">
            <div className="flex items-center mr-4">
              <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock size={16} className="mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center mr-4">
              <DollarSign size={16} className="mr-1" />
              <span>{restaurant.deliveryFee}</span>
            </div>
            <span className="badge badge-primary mt-1 md:mt-0">{restaurant.cuisine}</span>
          </div>
          
          <div className="flex items-start">
            <MapPin size={18} className="text-neutral-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-neutral-700">{restaurant.address}</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          {/* Category Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`py-2 px-4 rounded-full whitespace-nowrap transition ${
                    activeCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="space-y-6">
            {menu
              .filter(item => item.category === activeCategory)
              .map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
          </div>
        </div>
        
        {/* Map & Info Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-semibold text-lg mb-4">Restaurant Location</h3>
            <Map 
              markers={[
                {
                  position: restaurant.coordinates,
                  title: restaurant.name,
                  description: restaurant.address,
                  type: 'restaurant'
                }
              ]}
              height="250px"
              zoom={15}
              center={restaurant.coordinates}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-lg mb-4">Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;