import React, { useState, useEffect } from 'react';
import API from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurants');
        if (response.data.success) {
          setRestaurants(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Restaurants</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
