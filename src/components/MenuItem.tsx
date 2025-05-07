import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../types';
import { useCart } from '../context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddControls, setShowAddControls] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item, quantity);
    setQuantity(1);
    setShowAddControls(false);
  };

  return (
    <div className="card flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-1/4">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-48 md:h-full w-full object-cover"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-neutral-700 text-sm font-medium">${item.price.toFixed(2)}</p>
            </div>
            {item.popular && (
              <span className="badge badge-primary">Popular</span>
            )}
          </div>
          
          <p className="text-neutral-600 text-sm mt-2">{item.description}</p>
        </div>
        
        <div className="mt-4">
          {!showAddControls ? (
            <button 
              className="btn btn-primary w-full md:w-auto"
              onClick={() => setShowAddControls(true)}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;