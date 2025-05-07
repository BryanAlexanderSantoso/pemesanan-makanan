import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <h2 className="font-bold text-2xl">QuickBite</h2>
            <p className="text-neutral-400">
              Delicious food delivered fast to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-white hover:text-primary-500 transition">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-primary-500 transition">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-primary-500 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-neutral-400 hover:text-white transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-neutral-400 hover:text-white transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-neutral-400 hover:text-white transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-2 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-400">
                  123 Food Street, Delicious City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-400">
                  (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-primary-500" />
                <span className="text-neutral-400">
                  info@quickbite.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;