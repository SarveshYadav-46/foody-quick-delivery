import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Utensils, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { cart } = useCart();
  
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Utensils className="brand-icon" />
          <span>Foody</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/orders" className="nav-orders-link">
            <ClipboardList size={20} />
            <span>My Orders</span>
          </Link>
          <Link to="/cart" className="cart-link">
            <ShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
