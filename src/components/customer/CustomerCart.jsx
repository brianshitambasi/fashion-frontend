// components/customer/CustomerCart.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const BACKEND_URL = 'https://hair-salon-app-1.onrender.com';

const CustomerCart = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item from cart');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCart({ items: [], total: 0 });
      } else {
        alert('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart');
    }
  };

  const proceedToBooking = () => {
    if (!cart.items.length) {
      alert('Your cart is empty');
      return;
    }

    // Group items by shop
    const shops = {};
    cart.items.forEach(item => {
      if (!shops[item.shop._id]) {
        shops[item.shop._id] = {
          shop: item.shop,
          services: []
        };
      }
      shops[item.shop._id].services.push(item);
    });

    // If items from multiple shops, let user choose which shop to book
    const shopIds = Object.keys(shops);
    if (shopIds.length === 1) {
      // FIXED: Navigate to the correct booking route that exists
      navigate('/booking', { 
        state: { 
          shopId: shopIds[0],
          preselectedServices: shops[shopIds[0]].services 
        } 
      });
    } else {
      // Show shop selection modal or navigate to a selection page
      alert('Please book services from one shop at a time. You have items from multiple shops in your cart.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some services from our amazing salons to get started!</p>
          <Link 
            to="/shops"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Browse Salons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
      <p className="text-gray-600 mb-6">Review your selected services</p>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.serviceName}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Salon:</span> {item.shop?.name}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {item.shop?.location}
                </p>
                <p className="text-green-600 font-bold text-lg">
                  KSh {item.price?.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Total Amount</h3>
          <span className="text-2xl font-bold text-green-600">
            KSh {cart.total?.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex-1"
            disabled={processing}
          >
            Clear Cart
          </button>
          <button
            onClick={proceedToBooking}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex-1"
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              'Proceed to Booking'
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          💡 Payment will be done at the salon for your security
        </p>
      </div>
    </div>
  );
};

export default CustomerCart;