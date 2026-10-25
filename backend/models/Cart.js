const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem',
    required: true 
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true },
  subtotal: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: [cartItemSchema],
  totalAmount: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

// Middleware to automatically calculate subtotal and totalAmount before saving
// Uses async pattern (Mongoose 5+) - no need to call next(), the resolved promise signals completion
cartSchema.pre('save', async function () {
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });

  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
