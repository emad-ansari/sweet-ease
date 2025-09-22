import React, { useState } from 'react';
import { type Sweet } from '../types';
import { useSweets } from '../hooks/use-sweet';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
}

const categoryColors = {
  chocolate: 'from-amber-400 to-orange-500',
  gummy: 'from-green-400 to-emerald-500',
  'hard-candy': 'from-red-400 to-pink-500',
  lollipop: 'from-purple-400 to-indigo-500',
  cake: 'from-pink-400 to-rose-500',
  cookie: 'from-yellow-400 to-amber-500'
};

const SweetCard: React.FC<SweetCardProps> = ({ sweet }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useSweets();

  const handleAddToCart = async () => {
    if (sweet.quantity < quantity) return;
    
    setIsAdding(true);
    addToCart(sweet, quantity);
    
    // Reset quantity and show feedback
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  const incrementQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity <= 5 && sweet.quantity > 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-pink-100 group">
      <div className="relative overflow-hidden">
        <img
          src={sweet.image}
          alt={sweet.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 left-3 bg-gradient-to-r ${categoryColors[sweet.category]} text-white px-3 py-1 rounded-full text-sm font-medium capitalize`}>
          {sweet.category.replace('-', ' ')}
        </div>
        {isLowStock && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Low Stock
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-200">
          {sweet.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {sweet.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-pink-600">
            ${sweet.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {sweet.quantity}
          </span>
        </div>

        {!isOutOfStock && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors duration-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= sweet.quantity}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || quantity > sweet.quantity}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {isAdding ? 'Adding...' : `Add to Cart - $${(sweet.price * quantity).toFixed(2)}`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;