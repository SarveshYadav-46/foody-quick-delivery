const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create a new order from the user's cart
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Cannot place order.' });
    }

    // Calculate totals (same logic as Cart page frontend)
    const deliveryFee = 50;
    const taxes = Math.round(cart.totalAmount * 0.05);
    const finalTotal = cart.totalAmount + deliveryFee + taxes;

    // Create the order document
    const order = await Order.create({
      userId,
      items: cart.items.map(item => ({
        itemId: item.itemId,
        restaurantId: item.restaurantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        subtotal: item.subtotal
      })),
      totalAmount: cart.totalAmount,
      deliveryFee,
      taxes,
      finalTotal,
      status: 'Placed'
    });

    // Clear the cart after placing the order
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders?userId=user123
// @access  Public
const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId query parameter is required' });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (cancel) an order permanently from MongoDB
// @route   DELETE /api/orders/:id
// @access  Public
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Permanently delete the document from MongoDB
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled and deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder
};
