import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const USER_ID = 'user123';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  if (loading) return <div>Loading cart...</div>;

  if (!cart?.items?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-light)', margin: '1rem 0' }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/" className="btn">Browse Food</Link>
      </div>
    );
  }

  const deliveryFee = 50;
  const taxes = Math.round(cart.totalAmount * 0.05); // 5% tax
  const finalTotal = cart.totalAmount + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    setOrderError('');
    setOrderSuccess('');
    setPlacingOrder(true);

    try {
      const response = await API.post('/orders', { userId: USER_ID });
      if (response.data.success) {
        // Clear local cart state (backend already cleared the DB cart)
        await clearCart();
        setOrderSuccess('Order placed successfully! Redirecting to My Orders...');
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        setOrderError('Failed to place order. Please try again.');
      }
    } catch (err) {
      setOrderError(
        err?.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>

      {/* Error / Success banners */}
      {orderError && (
        <div className="cart-message cart-message--error">
          <AlertCircle size={18} />
          <span>{orderError}</span>
        </div>
      )}
      {orderSuccess && (
        <div className="cart-message cart-message--success">
          <CheckCircle size={18} />
          <span>{orderSuccess}</span>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Items ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})</h2>
            <button className="btn-outline" onClick={clearCart} style={{ padding: '0.5rem', borderRadius: '4px' }}>
              Clear Cart
            </button>
          </div>
          
          {cart.items.map(item => (
            <div key={item.itemId} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{item.name}</h3>
                  <strong style={{ fontSize: '1.125rem' }}>₹{item.subtotal}</strong>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <div className="qty-control">
                    <button 
                      className="qty-btn"
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.itemId);
                        } else {
                          updateQuantity(item.itemId, item.quantity - 1);
                        }
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '500', width: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    onClick={() => removeFromCart(item.itemId)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 style={{ marginBottom: '1.5rem' }}>Bill Details</h2>
          
          <div className="summary-row">
            <span>Item Total</span>
            <span>₹{cart.totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="summary-row">
            <span>Taxes and Charges</span>
            <span>₹{taxes}</span>
          </div>
          
          <div className="summary-row summary-total">
            <span>To Pay</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            id="btn-place-order"
            className="btn"
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.125rem' }}
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder
              ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Loader2 className="spin-icon" size={20} />
                  Placing order...
                </span>
              )
              : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
