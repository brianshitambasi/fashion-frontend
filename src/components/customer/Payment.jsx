// components/customer/Payment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BACKEND_URL = 'https://hair-salon-app-1.onrender.com';

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // FIXED: Fetch all bookings and find the specific one
  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BACKEND_URL}/booking`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Find the specific booking from all bookings
      const foundBooking = response.data.find(booking => booking._id === bookingId);
      
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        setError('Booking not found');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^(254|\+254|0)?(7|1)\d{8}$/.test(cleaned);
  };

  const formatPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    if (!booking || !booking.totalPrice) {
      setError('Invalid booking information');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formattedPhone = formatPhone(phoneNumber);

      console.log('Initiating payment for booking:', bookingId);
      console.log('Amount:', booking.totalPrice);
      console.log('Phone:', formattedPhone);

      const paymentResponse = await axios.post(
        `${BACKEND_URL}/payment`,
        {
          booking: bookingId,
          amount: booking.totalPrice,
          method: 'mpesa',
          phone: formattedPhone
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Payment response:', paymentResponse.data);

      setSuccess('Payment initiated successfully! Check your phone for M-Pesa prompt.');
      
      // Redirect to bookings page after 3 seconds
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Booking Not Found</h2>
          <p className="text-red-600 mb-4">The booking you're trying to pay for doesn't exist.</p>
          <button
            onClick={() => navigate('/customer/bookings')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Payment</h1>
        
        {/* Booking Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Booking Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Shop:</span> {booking.shop?.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Services:</span>
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-600">
              {booking.services?.map((service, index) => (
                <li key={index}>
                  {service.serviceName} - KSh {service.price?.toLocaleString()}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-green-600 mt-3">
              Total Amount: KSh {booking.totalPrice?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">M-Pesa Payment</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your M-Pesa number (e.g., 0712345678)"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              disabled={processing}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the phone number registered with M-Pesa
            </p>
          </div>

          <button
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold text-lg"
            onClick={handlePayment}
            disabled={processing || !phoneNumber}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </span>
            ) : (
              `Pay KSh ${booking.totalPrice?.toLocaleString()} via M-Pesa`
            )}
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="text-blue-600 hover:text-blue-800 font-medium"
            disabled={processing}
          >
            ← Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;