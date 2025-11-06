import React, { useState, useEffect } from 'react';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend base URL
  const BACKEND_URL = 'https://hair-salon-app-hypp.onrender.com';

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BACKEND_URL}/api/shops`);
      
      if (!response.ok) {
        throw new Error(`Failed to load shops: ${response.status}`);
      }
      
      const shopsData = await response.json();
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading shops...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button 
          onClick={fetchShops}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hair Salons</h1>
      
      {shops.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No shops available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-lg shadow-md p-6 border">
              {shop.image && (
                <img 
                  src={`${BACKEND_URL}${shop.image}`} 
                  alt={shop.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              
              <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
              <p className="text-gray-600 mb-2">📍 {shop.location}</p>
              <p className="text-gray-700 mb-3">{shop.description}</p>
              
              {shop.services && shop.services.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Services:</h3>
                  <ul className="space-y-1">
                    {shop.services.map((service, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{service.serviceName}</span>
                        <span>${service.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1">{shop.rating || 'No ratings'}</span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;