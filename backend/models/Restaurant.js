const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  cuisine: [{ type: String, required: true }],
  location: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  deliveryTime: { type: String, required: true },
  priceForTwo: { type: Number, required: true },
  isOpen: { type: Boolean, required: true, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
