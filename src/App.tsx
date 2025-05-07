import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { OrderProvider } from './context/OrderContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import LocationPage from './pages/LocationPage';

function App() {
  return (
    <Router>
      <LocationProvider>
        <CartProvider>
          <OrderProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/order/:id" element={<OrderPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/location" element={<LocationPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;