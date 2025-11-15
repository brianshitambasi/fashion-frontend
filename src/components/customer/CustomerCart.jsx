// components/customer/CustomerCart.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerCart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const BACKEND_URL = 'https://hair-salon-app-1.onrender.com';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BACKEND_URL}/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BACKEND_URL}/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // FIXED: Create booking and redirect to payment with correct path
  const proceedToCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');

      // Create checkout data with all cart items
      const checkoutData = {
        items: cart.items.map(item => ({
          serviceName: item.serviceName,
          price: item.price,
          shop: item.shop._id
        })),
        dateTime: new Date().toISOString()
      };

      console.log('Creating booking for payment...');

      // Create booking first
      const bookingResponse = await axios.post(
        `${BACKEND_URL}/booking/checkout`,
        checkoutData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Booking created:', bookingResponse.data);

      // Get the booking ID from response
      const bookingId = bookingResponse.data.booking?._id || bookingResponse.data._id;
      
      if (!bookingId) {
        throw new Error('No booking ID received from server');
      }

      // Clear cart after successful booking creation
      await axios.delete(`${BACKEND_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Redirecting to payment for booking:', bookingId);
      
      // FIXED: Use the correct path that matches your App.js route
      navigate(`/customer/payment/${bookingId}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 404) {
          alert('Checkout service not found. Please contact support.');
        } else if (error.response.status === 401) {
          alert('Please log in again.');
          navigate('/login');
        } else {
          alert(error.response.data?.message || 'Checkout failed. Please try again.');
        }
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  // UI Rendering
  if (loading) return (
    <div className="container py-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2">Loading cart...</p>
    </div>
  );

  if (!cart || cart.items.length === 0)
    return (
      <div className="container py-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/shops')}
          >
            Browse Shops
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="text-lg font-semibold text-gray-800">{item.serviceName}</h5>
                <p className="text-gray-600">{item.shop?.name}</p>
                <p className="text-green-600 font-medium mt-1">KSh {item.price?.toLocaleString()}</p>
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors ml-4"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Total:</h4>
          <span className="text-2xl font-bold text-green-600">
            KSh {cart.total?.toLocaleString()}
          </span>
        </div>

        <div className="flex space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex-1"
            onClick={clearCart}
            disabled={processing}
          >
            Clear Cart
          </button>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex-1"
            onClick={proceedToCheckout}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCart;