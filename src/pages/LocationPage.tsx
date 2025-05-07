import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search } from 'lucide-react';
import Map from '../components/Map';
import { useLocation } from '../context/LocationContext';
import { UserLocation } from '../types';

const LocationPage: React.FC = () => {
  const { userLocation, getCurrentLocation, setManualLocation, isLoading, error } = useLocation();
  const [address, setAddress] = useState('');
  const [savedLocations, setSavedLocations] = useState<UserLocation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLocation?.address) {
      setAddress(userLocation.address);
    }
  }, [userLocation]);

  const handleGetCurrentLocation = async () => {
    await getCurrentLocation();
    navigate(-1);
  };

  const handleSaveManualLocation = () => {
    if (!address) return;
    
    // For a real app, we would geocode the address to get coordinates
    // For now, we'll use fixed coordinates
    const newLocation: UserLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
      address
    };
    
    setManualLocation(newLocation);
    navigate(-1);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Delivery Location</h1>
        
        {/* Current Location Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Current Location</h2>
          
          {userLocation ? (
            <div className="mb-4">
              <div className="flex items-start mb-4">
                <MapPin size={20} className="mt-1 mr-2 flex-shrink-0 text-primary-500" />
                <div>
                  <p className="font-medium">{userLocation.address || 'Current Location'}</p>
                  <p className="text-sm text-neutral-500">
                    {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              
              <div className="h-[200px] mb-4">
                <Map 
                  markers={[
                    {
                      position: [userLocation.latitude, userLocation.longitude],
                      title: userLocation.address || 'Current Location',
                      type: 'user'
                    }
                  ]}
                  height="200px"
                  zoom={15}
                  center={[userLocation.latitude, userLocation.longitude]}
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 text-center py-4">
              <p className="text-neutral-600 mb-4">
                No location set. Allow location access or enter your address manually.
              </p>
            </div>
          )}
          
          <button 
            className="btn btn-primary w-full flex items-center justify-center"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
          >
            <Navigation size={18} className="mr-2" />
            {isLoading ? 'Getting Location...' : 'Use My Current Location'}
          </button>
          
          {error && (
            <p className="text-error-500 text-sm mt-2">
              Error: {error}. Please try again or enter your address manually.
            </p>
          )}
        </div>
        
        {/* Manual Location Entry */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Enter Address Manually</h2>
          
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
              Delivery Address
            </label>
            <div className="flex">
              <input 
                type="text" 
                id="address" 
                className="input rounded-r-none flex-1"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button 
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 rounded-r-md focus:outline-none"
                onClick={handleSaveManualLocation}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Saved Locations (Example) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Locations</h2>
          
          {savedLocations.length > 0 ? (
            <div className="divide-y">
              {savedLocations.map((location, index) => (
                <div key={index} className="py-3 flex items-start">
                  <MapPin size={20} className="mt-1 mr-2 flex-shrink-0 text-primary-500" />
                  <div className="flex-1">
                    <p className="font-medium">{location.address}</p>
                    <p className="text-sm text-neutral-500">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setManualLocation(location);
                      navigate(-1);
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-neutral-500">
              You don't have any saved locations yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;