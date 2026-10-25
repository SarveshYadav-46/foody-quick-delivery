import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import MenuCard from '../components/MenuCard';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/menu?restaurantId=${id}`)
        ]);

        if (resResponse.data.success) setRestaurant(resResponse.data.data);
        if (menuResponse.data.success) setMenuItems(menuResponse.data.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        gap: '2rem'
      }}>
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
        />
        <div>
          <h1 style={{ marginBottom: '1rem' }}>{restaurant.name}</h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>{restaurant.cuisine.join(', ')}</p>
          <p style={{ marginBottom: '0.5rem' }}>{restaurant.location}</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '1.25rem' }}>{restaurant.rating} ★</strong>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Rating</span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1.25rem' }}>{restaurant.deliveryTime}</strong>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Delivery Time</span>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1.25rem' }}>₹{restaurant.priceForTwo}</strong>
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Cost for two</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Menu</h2>
      <div className="menu-grid">
        {menuItems.map(item => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetails;
