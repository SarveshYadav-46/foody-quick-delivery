import React from 'react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80';

const MenuCard = ({ item }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // ci.itemId may be an ObjectId object from MongoDB; item._id is a plain string from JSON.
  // Convert both to string to ensure reliable comparison.
  const cartItem = cart?.items?.find(ci => String(ci.itemId) === String(item._id));

  return (
    <div className="card">
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        className="card-img"
        onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
      />
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h3 className="card-title">{item.name}</h3>
          <span className={`badge ${item.foodType}`}>
            {item.foodType === 'veg' ? 'VEG' : 'NON-VEG'}
          </span>
        </div>
        <p className="card-desc">{item.description}</p>
        
        <div className="card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            ₹{item.price}
          </div>
          
          {cartItem ? (
            <div className="qty-control">
              <button 
                className="qty-btn"
                onClick={() => {
                  if (cartItem.quantity === 1) {
                    removeFromCart(item._id);
                  } else {
                    updateQuantity(item._id, cartItem.quantity - 1);
                  }
                }}
              >
                -
              </button>
              <span style={{ fontWeight: '500', width: '20px', textAlign: 'center' }}>
                {cartItem.quantity}
              </span>
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
              >
                +
              </button>
            </div>
          ) : (
            <button className="btn" onClick={() => addToCart(item._id)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
