const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant',
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Pizza, Burger
  cuisine: { type: String, required: true }, // e.g., Indian, Italian
  foodType: { 
    type: String, 
    required: true,
    enum: ['veg', 'non-veg'] 
  },
  rating: { type: Number, required: true, default: 0 },
  available: { type: Boolean, required: true, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
