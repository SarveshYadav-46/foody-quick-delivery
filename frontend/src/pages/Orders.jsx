import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { ClipboardList, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const USER_ID = 'user123';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Confirm dialog state
  const [confirmOrderId, setConfirmOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Success / error toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/orders?userId=${USER_ID}`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelClick = (orderId) => {
    setConfirmOrderId(orderId);
  };

  const handleConfirmCancel = async () => {
    const orderId = confirmOrderId;
    setConfirmOrderId(null);
    setCancellingId(orderId);

    try {
      const response = await API.delete(`/orders/${orderId}`);
      if (response.data.success) {
        // Remove from local state only after backend confirms deletion
        setOrders(prev => prev.filter(o => o._id !== orderId));
        showToast('Order cancelled successfully.', 'success');
      } else {
        showToast('Cancellation failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Cancellation failed. The order was NOT removed.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handleKeepOrder = () => {
    setConfirmOrderId(null);
  };

  // ── Formatters ──────────────────────────────────────────────────
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const shortId = (id) => id?.slice(-6).toUpperCase();

  // ── Render ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="orders-loading">
        <Loader2 className="spin-icon" size={40} />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <AlertCircle size={40} color="#ef4444" />
        <p>{error}</p>
        <button className="btn" onClick={fetchOrders}>Retry</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Toast notification */}
      {toast.visible && (
        <div className={`orders-toast orders-toast--${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle size={18} />
            : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirm cancel modal */}
      {confirmOrderId && (
        <div className="orders-modal-overlay">
          <div className="orders-modal">
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel <strong>Order #{shortId(confirmOrderId)}</strong>?<br />
              This action cannot be undone.</p>
            <div className="orders-modal-actions">
              <button
                id="btn-confirm-cancel"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel
              </button>
              <button
                id="btn-keep-order"
                className="btn btn-outline"
                onClick={handleKeepOrder}
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="orders-header">
        <ClipboardList size={28} />
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <ClipboardList size={64} color="#d1d5db" />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders. Go ahead and order something delicious!</p>
          <Link to="/" className="btn">Browse Food</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              {/* Order header */}
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{shortId(order._id)}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`order-status order-status--placed`}>
                  {order.status}
                </span>
              </div>

              {/* Order items */}
              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.image} alt={item.name} className="order-item-img" />
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="order-item-subtotal">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Bill summary */}
              <div className="order-bill">
                <div className="order-bill-row">
                  <span>Item Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="order-bill-row">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="order-bill-row">
                  <span>Taxes &amp; Charges</span>
                  <span>₹{order.taxes}</span>
                </div>
                <div className="order-bill-row order-bill-total">
                  <span>Total Paid</span>
                  <span>₹{order.finalTotal}</span>
                </div>
              </div>

              {/* Cancel button */}
              <div className="order-card-footer">
                {cancellingId === order._id ? (
                  <button className="btn btn-danger order-cancel-btn" disabled>
                    <Loader2 className="spin-icon" size={16} />
                    Cancelling order...
                  </button>
                ) : (
                  <button
                    id={`btn-cancel-order-${order._id}`}
                    className="btn btn-danger order-cancel-btn"
                    onClick={() => handleCancelClick(order._id)}
                  >
                    <Trash2 size={16} />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
