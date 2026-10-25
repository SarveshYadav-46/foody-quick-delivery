import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="card">
      <img src={restaurant.image} alt={restaurant.name} className="card-img" />
      <div className="card-content">
        <h3 className="card-title">{restaurant.name}</h3>
        <p className="card-desc">{restaurant.cuisine.join(', ')}</p>
        
        <div className="card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={16} fill="#eab308" color="#eab308" />
            <span style={{ fontWeight: '600' }}>{restaurant.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-light)', fontSize: '0.875rem' }}>
            <Clock size={16} />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            ₹{restaurant.priceForTwo} for two
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
