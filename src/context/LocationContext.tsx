import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLocation } from '../types';

interface LocationContextType {
  userLocation: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  setManualLocation: (location: UserLocation) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location on initial render
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setUserLocation(JSON.parse(savedLocation));
      }
    } catch (error) {
      console.error('Error loading location from localStorage:', error);
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (userLocation) {
      try {
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
      } catch (error) {
        console.error('Error saving location to localStorage:', error);
      }
    }
  }, [userLocation]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // For a real app, we would use reverse geocoding here to get the address
      // For now, we'll just use the coordinates
      const newLocation: UserLocation = {
        latitude,
        longitude,
        address: 'Current Location'
      };
      
      setUserLocation(newLocation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error getting current location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setManualLocation = (location: UserLocation) => {
    setUserLocation(location);
  };

  return (
    <LocationContext.Provider value={{
      userLocation,
      isLoading,
      error,
      getCurrentLocation,
      setManualLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};