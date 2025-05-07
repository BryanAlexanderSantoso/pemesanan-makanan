import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, ShoppingBag } from 'lucide-react';
import { restaurants, cuisines } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { useLocation } from '../context/LocationContext';

const HomePage: React.FC = () => {
  const { userLocation, getCurrentLocation, isLoading } = useLocation();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center flex items-center" style={{ 
        backgroundImage: 'url(https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260)'
      }}>
        <div className="absolute inset-0 bg-neutral-900/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Delicious food delivered fast
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Order from your favorite restaurants and track your delivery in real-time
            </p>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg p-1 flex">
              <div className="flex-1 flex items-center px-3">
                <Search size={20} className="text-neutral-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search for restaurants or food..."
                  className="w-full py-3 focus:outline-none"
                />
              </div>
              <Link to="/restaurants" className="btn btn-primary whitespace-nowrap">
                Find Food
              </Link>
            </div>
            
            {!userLocation && (
              <button 
                className="mt-6 flex items-center text-white font-medium hover:text-primary-300 transition-colors"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                <MapPin size={18} className="mr-2" />
                {isLoading ? 'Getting your location...' : 'Use my current location'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
              <p className="text-neutral-600">Find your favorite meals from a variety of restaurants.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-neutral-600">Choose items and customize them to your liking.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-neutral-600">Track your order in real-time until it arrives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Restaurants</h2>
            <Link to="/restaurants" className="font-medium text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.slice(0, 6).map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Cuisines</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cuisines.filter(c => c !== 'All').map(cuisine => (
              <Link 
                key={cuisine}
                to={`/restaurants?cuisine=${cuisine}`}
                className="bg-neutral-100 rounded-lg p-4 text-center hover:bg-primary-50 hover:text-primary-600 transition-colors group"
              >
                <h3 className="font-medium">{cuisine}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hungry? Let's fix that!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Order from a wide selection of restaurants and get your food delivered to your doorstep.
          </p>
          <Link to="/restaurants" className="btn bg-white text-primary-600 hover:bg-neutral-100">
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;