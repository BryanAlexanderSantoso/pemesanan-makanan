import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, MapPin } from 'lucide-react';
import { restaurants, cuisines } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import Map from '../components/Map';
import { useLocation } from '../context/LocationContext';
import { Restaurant } from '../types';

const RestaurantsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const { userLocation } = useLocation();
  
  useEffect(() => {
    // Get cuisine from URL params if available
    const cuisineParam = searchParams.get('cuisine');
    if (cuisineParam && cuisines.includes(cuisineParam)) {
      setActiveCuisine(cuisineParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...restaurants];
    
    // Filter by cuisine
    if (activeCuisine !== 'All') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === activeCuisine);
    }
    
    setFilteredRestaurants(filtered);
  }, [activeCuisine]);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="min-h-screen pt-16 bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <button 
            className="btn btn-outline flex items-center"
            onClick={toggleMap}
          >
            <MapPin size={18} className="mr-2" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {/* Map View (conditionally rendered) */}
        {showMap && (
          <div className="mb-8 h-[400px]">
            <Map 
              markers={filteredRestaurants.map(restaurant => ({
                position: restaurant.coordinates,
                title: restaurant.name,
                description: `${restaurant.cuisine} • ${restaurant.deliveryTime}`,
                type: 'restaurant'
              })).concat(
                userLocation ? [{
                  position: [userLocation.latitude, userLocation.longitude],
                  title: userLocation.address || 'Your Location',
                  type: 'user'
                }] : []
              )}
              height="400px"
            />
          </div>
        )}

        {/* Cuisine Filters */}
        <div className="mb-8 overflow-auto pb-2">
          <div className="flex space-x-2">
            {cuisines.map(cuisine => (
              <button
                key={cuisine}
                className={`py-2 px-4 rounded-full whitespace-nowrap transition ${
                  activeCuisine === cuisine
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setActiveCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-neutral-500">
            {filteredRestaurants.length} restaurants found
          </div>
          <div className="flex items-center">
            <button className="btn btn-outline flex items-center">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No restaurants found</h3>
            <p className="text-neutral-600 mb-4">
              Try changing your filters or search criteria.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setActiveCuisine('All')}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;