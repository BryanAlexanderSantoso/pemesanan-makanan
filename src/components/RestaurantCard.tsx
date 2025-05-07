import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="card group">
      <div className="relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <span className="badge badge-primary">{restaurant.cuisine}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        
        <div className="flex items-center text-sm text-neutral-600 mb-2">
          <div className="flex items-center">
            <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1" />
            <span>{restaurant.deliveryFee}</span>
          </div>
        </div>
        
        <p className="text-sm text-neutral-500 truncate">{restaurant.address}</p>
      </div>
    </Link>
  );
};

export default RestaurantCard;