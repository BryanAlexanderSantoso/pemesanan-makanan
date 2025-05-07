import React, { useState, useEffect } from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { MapPin, ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { userLocation } = useLocation();
  const location = useRouterLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white shadow-md py-2' 
      : 'bg-gradient-to-b from-neutral-900/70 to-transparent py-4'
  }`;

  const textClasses = isScrolled 
    ? 'text-neutral-900' 
    : location.pathname === '/' 
      ? 'text-white' 
      : 'text-neutral-900';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className={`font-bold text-2xl ${textClasses}`}>
            QuickBite
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-medium ${textClasses} hover:text-primary-500`}>
              Home
            </Link>
            <Link to="/restaurants" className={`font-medium ${textClasses} hover:text-primary-500`}>
              Restaurants
            </Link>
            <Link to="/orders" className={`font-medium ${textClasses} hover:text-primary-500`}>
              My Orders
            </Link>
          </nav>

          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/location" className={`flex items-center ${textClasses} hover:text-primary-500`}>
              <MapPin size={20} className="mr-1" />
              <span className="text-sm truncate max-w-[100px]">
                {userLocation ? (userLocation.address || 'Current Location') : 'Set Location'}
              </span>
            </Link>
            <Link to="/search" className={`${textClasses} hover:text-primary-500`}>
              <Search size={20} />
            </Link>
            <Link to="/account" className={`${textClasses} hover:text-primary-500`}>
              <User size={20} />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingBag size={20} className={textClasses} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className={textClasses} />
            ) : (
              <Menu size={24} className={textClasses} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/restaurants" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Restaurants
              </Link>
              <Link 
                to="/orders" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link 
                to="/location" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin size={18} className="mr-2" />
                <span>
                  {userLocation ? (userLocation.address || 'Current Location') : 'Set Location'}
                </span>
              </Link>
              <Link 
                to="/search" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search size={18} className="mr-2" />
                <span>Search</span>
              </Link>
              <Link 
                to="/account" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} className="mr-2" />
                <span>My Account</span>
              </Link>
              <Link 
                to="/cart" 
                className="py-2 px-4 hover:bg-neutral-100 rounded-md flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;