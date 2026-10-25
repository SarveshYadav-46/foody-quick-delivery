const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder
} = require('../controllers/orderController');

// POST /api/orders          → Create (place) a new order
// GET  /api/orders?userId=  → Get all orders for a user
router.route('/')
  .post(createOrder)
  .get(getOrders);

// GET    /api/orders/:id → Get a single order
// DELETE /api/orders/:id → Permanently delete an order from MongoDB
router.route('/:id')
  .get(getOrderById)
  .delete(deleteOrder);

module.exports = router;
