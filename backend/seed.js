require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Cart = require('./models/Cart');
const connectDB = require('./config/db');

// Sample Restaurants
const restaurants = [
  {
    name: "Spicy Indian Curry",
    image: "https://images.unsplash.com/photo-1585937421606-0d25d19bc245?w=500&q=80",
    cuisine: ["Indian", "Punjabi"],
    location: "Downtown Plaza",
    rating: 4.5,
    deliveryTime: "30-45 min",
    priceForTwo: 500,
    isOpen: true
  },
  {
    name: "Dragon Wok",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80",
    cuisine: ["Chinese"],
    location: "Central Market",
    rating: 4.2,
    deliveryTime: "25-40 min",
    priceForTwo: 600,
    isOpen: true
  },
  {
    name: "Mama Mia Pizzeria",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    cuisine: ["Italian", "Fast Food"],
    location: "Westside Mall",
    rating: 4.7,
    deliveryTime: "20-35 min",
    priceForTwo: 800,
    isOpen: true
  },
  {
    name: "South Indian Delights",
    image: "https://images.unsplash.com/photo-1610192772591-665e75529a67?w=500&q=80",
    cuisine: ["South Indian"],
    location: "Tech Park",
    rating: 4.6,
    deliveryTime: "15-30 min",
    priceForTwo: 300,
    isOpen: true
  },
  {
    name: "Burger Haven",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    cuisine: ["Fast Food"],
    location: "University Road",
    rating: 4.1,
    deliveryTime: "20-30 min",
    priceForTwo: 400,
    isOpen: true
  },
  {
    name: "Punjab Grill",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80",
    cuisine: ["Punjabi", "Indian"],
    location: "Heritage Square",
    rating: 4.8,
    deliveryTime: "40-55 min",
    priceForTwo: 1000,
    isOpen: true
  },
  {
    name: "Noodle Story",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    cuisine: ["Chinese"],
    location: "East End",
    rating: 4.0,
    deliveryTime: "25-35 min",
    priceForTwo: 450,
    isOpen: true
  },
  {
    name: "Italiano Express",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=80",
    cuisine: ["Italian"],
    location: "Business District",
    rating: 4.3,
    deliveryTime: "30-45 min",
    priceForTwo: 700,
    isOpen: true
  },
  {
    name: "Dosa Point",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&q=80",
    cuisine: ["South Indian"],
    location: "Station Road",
    rating: 4.4,
    deliveryTime: "15-25 min",
    priceForTwo: 200,
    isOpen: true
  },
  {
    name: "Biryani House",
    image: "https://images.unsplash.com/photo-1563379926898-05f45c51040c?w=500&q=80",
    cuisine: ["Indian"],
    location: "Old City",
    rating: 4.9,
    deliveryTime: "35-50 min",
    priceForTwo: 650,
    isOpen: true
  }
];

// Sample Menu Items template function
const getMenuItemsTemplate = (restaurantsDict) => [
  // Spicy Indian Curry (Indian, Punjabi)
  {
    restaurantId: restaurantsDict['Spicy Indian Curry'],
    name: "Paneer Butter Masala",
    description: "Rich and creamy curry made with paneer, spices, onions, tomatoes, cashews and butter.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80",
    price: 280,
    category: "Curry",
    cuisine: "Indian",
    foodType: "veg",
    rating: 4.6
  },
  {
    restaurantId: restaurantsDict['Spicy Indian Curry'],
    name: "Chicken Tikka Masala",
    description: "Roasted marinated chicken chunks in spiced curry sauce.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
    price: 350,
    category: "Curry",
    cuisine: "Indian",
    foodType: "non-veg",
    rating: 4.8
  },
  {
    restaurantId: restaurantsDict['Spicy Indian Curry'],
    name: "Garlic Naan",
    description: "Soft Indian flatbread topped with garlic and butter.",
    image: "https://images.unsplash.com/photo-1605333396914-2c6cdd22e6b9?w=500&q=80",
    price: 60,
    category: "Breads",
    cuisine: "Indian",
    foodType: "veg",
    rating: 4.5
  },
  
  // Dragon Wok (Chinese)
  {
    restaurantId: restaurantsDict['Dragon Wok'],
    name: "Hakka Noodles",
    description: "Stir-fried noodles with crisp vegetables and soy sauce.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80",
    price: 180,
    category: "Noodles",
    cuisine: "Chinese",
    foodType: "veg",
    rating: 4.2
  },
  {
    restaurantId: restaurantsDict['Dragon Wok'],
    name: "Chilli Chicken",
    description: "Sweet, spicy & slightly sour crispy appetizer made with chicken, bell peppers, garlic, chilli sauce & soya sauce.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80",
    price: 250,
    category: "Starter",
    cuisine: "Chinese",
    foodType: "non-veg",
    rating: 4.5
  },
  {
    restaurantId: restaurantsDict['Dragon Wok'],
    name: "Veg Manchurian",
    description: "Fried veggie balls in a spicy, sweet and tangy sauce.",
    image: "https://images.unsplash.com/photo-1626804475297-41609ea143eb?w=500&q=80",
    price: 200,
    category: "Starter",
    cuisine: "Chinese",
    foodType: "veg",
    rating: 4.3
  },

  // Mama Mia Pizzeria (Italian, Fast Food)
  {
    restaurantId: restaurantsDict['Mama Mia Pizzeria'],
    name: "Margherita Pizza",
    description: "Classic delight with 100% real mozzarella cheese.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    price: 350,
    category: "Pizza",
    cuisine: "Italian",
    foodType: "veg",
    rating: 4.6
  },
  {
    restaurantId: restaurantsDict['Mama Mia Pizzeria'],
    name: "Pepperoni Pizza",
    description: "A classic American favorite with premium pepperoni and cheese.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
    price: 450,
    category: "Pizza",
    cuisine: "Italian",
    foodType: "non-veg",
    rating: 4.8
  },
  {
    restaurantId: restaurantsDict['Mama Mia Pizzeria'],
    name: "Garlic Bread",
    description: "Freshly baked garlic bread with cheese.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80",
    price: 150,
    category: "Starter",
    cuisine: "Fast Food",
    foodType: "veg",
    rating: 4.4
  },

  // South Indian Delights (South Indian)
  {
    restaurantId: restaurantsDict['South Indian Delights'],
    name: "Masala Dosa",
    description: "Crispy crepe stuffed with a spiced potato filling.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&q=80",
    price: 120,
    category: "Dosa",
    cuisine: "South Indian",
    foodType: "veg",
    rating: 4.7
  },
  {
    restaurantId: restaurantsDict['South Indian Delights'],
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil soup and coconut chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&q=80",
    price: 80,
    category: "Breakfast",
    cuisine: "South Indian",
    foodType: "veg",
    rating: 4.5
  },
  {
    restaurantId: restaurantsDict['South Indian Delights'],
    name: "Medu Vada",
    description: "Crispy fried lentil donuts served with sambar and chutney.",
    image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80",
    price: 90,
    category: "Breakfast",
    cuisine: "South Indian",
    foodType: "veg",
    rating: 4.4
  },

  // Burger Haven (Fast Food)
  {
    restaurantId: restaurantsDict['Burger Haven'],
    name: "Classic Veg Burger",
    description: "Crispy veg patty with lettuce, tomatoes, and our special sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    price: 150,
    category: "Burger",
    cuisine: "Fast Food",
    foodType: "veg",
    rating: 4.3
  },
  {
    restaurantId: restaurantsDict['Burger Haven'],
    name: "Double Cheese Chicken Burger",
    description: "Juicy double chicken patty with extra cheese and caramelized onions.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    price: 280,
    category: "Burger",
    cuisine: "Fast Food",
    foodType: "non-veg",
    rating: 4.8
  },
  {
    restaurantId: restaurantsDict['Burger Haven'],
    name: "French Fries",
    description: "Crispy golden french fries salted to perfection.",
    image: "https://images.unsplash.com/photo-1576107223062-7935de98b091?w=500&q=80",
    price: 90,
    category: "Sides",
    cuisine: "Fast Food",
    foodType: "veg",
    rating: 4.5
  },

  // Punjab Grill (Punjabi, Indian)
  {
    restaurantId: restaurantsDict['Punjab Grill'],
    name: "Dal Makhani",
    description: "Whole black lentils cooked with butter and cream and simmered on low heat for that unique flavor.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
    price: 250,
    category: "Curry",
    cuisine: "Punjabi",
    foodType: "veg",
    rating: 4.7
  },
  {
    restaurantId: restaurantsDict['Punjab Grill'],
    name: "Butter Chicken",
    description: "Chunks of grilled chicken cooked in a smooth buttery & creamy tomato based gravy.",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80",
    price: 380,
    category: "Curry",
    cuisine: "Punjabi",
    foodType: "non-veg",
    rating: 4.9
  },
  {
    restaurantId: restaurantsDict['Punjab Grill'],
    name: "Amritsari Kulcha",
    description: "Crisp and soft leavened flatbread stuffed with a spiced potato filling.",
    image: "https://images.unsplash.com/photo-1605333396914-2c6cdd22e6b9?w=500&q=80",
    price: 80,
    category: "Breads",
    cuisine: "Punjabi",
    foodType: "veg",
    rating: 4.6
  },

  // Noodle Story (Chinese)
  {
    restaurantId: restaurantsDict['Noodle Story'],
    name: "Chicken Schezwan Noodles",
    description: "Spicy stir-fried noodles with chicken and schezwan sauce.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    price: 220,
    category: "Noodles",
    cuisine: "Chinese",
    foodType: "non-veg",
    rating: 4.4
  },
  {
    restaurantId: restaurantsDict['Noodle Story'],
    name: "Veg Fried Rice",
    description: "Fluffy rice tossed with finely chopped vegetables and soy sauce.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
    price: 180,
    category: "Rice",
    cuisine: "Chinese",
    foodType: "veg",
    rating: 4.3
  },

  // Italiano Express (Italian)
  {
    restaurantId: restaurantsDict['Italiano Express'],
    name: "Penne Alfredo",
    description: "Penne pasta tossed in a rich, creamy cheese sauce with mushrooms.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    price: 290,
    category: "Pasta",
    cuisine: "Italian",
    foodType: "veg",
    rating: 4.5
  },
  {
    restaurantId: restaurantsDict['Italiano Express'],
    name: "Chicken Bolognese",
    description: "Spaghetti pasta topped with a slow-cooked meaty tomato sauce.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    price: 340,
    category: "Pasta",
    cuisine: "Italian",
    foodType: "non-veg",
    rating: 4.6
  },

  // Dosa Point (South Indian)
  {
    restaurantId: restaurantsDict['Dosa Point'],
    name: "Mysore Masala Dosa",
    description: "Crispy dosa layered with spicy red chutney and stuffed with potato masala.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&q=80",
    price: 140,
    category: "Dosa",
    cuisine: "South Indian",
    foodType: "veg",
    rating: 4.8
  },
  {
    restaurantId: restaurantsDict['Dosa Point'],
    name: "Uttapam",
    description: "Thick pancake made from dosa batter topped with mixed vegetables.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500&q=80",
    price: 130,
    category: "Breakfast",
    cuisine: "South Indian",
    foodType: "veg",
    rating: 4.5
  },

  // Biryani House (Indian)
  {
    restaurantId: restaurantsDict['Biryani House'],
    name: "Hyderabadi Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken pieces, blended with herbs and spices.",
    image: "https://images.unsplash.com/photo-1563379926898-05f45c51040c?w=500&q=80",
    price: 320,
    category: "Biryani",
    cuisine: "Indian",
    foodType: "non-veg",
    rating: 4.9
  },
  {
    restaurantId: restaurantsDict['Biryani House'],
    name: "Veg Dum Biryani",
    description: "Mixed vegetables and rice cooked slowly in a sealed pot.",
    image: "https://images.unsplash.com/photo-1563379926898-05f45c51040c?w=500&q=80",
    price: 250,
    category: "Biryani",
    cuisine: "Indian",
    foodType: "veg",
    rating: 4.6
  },
  {
    restaurantId: restaurantsDict['Biryani House'],
    name: "Mutton Biryani",
    description: "Flavorful rice cooked with succulent pieces of mutton and traditional spices.",
    image: "https://images.unsplash.com/photo-1563379926898-05f45c51040c?w=500&q=80",
    price: 450,
    category: "Biryani",
    cuisine: "Indian",
    foodType: "non-veg",
    rating: 4.8
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Cart.deleteMany();

    console.log('Inserting restaurants...');
    const createdRestaurants = await Restaurant.insertMany(restaurants);

    // Create a dictionary mapping restaurant names to their generated ObjectIds
    const restaurantsDict = {};
    createdRestaurants.forEach(res => {
      restaurantsDict[res.name] = res._id;
    });

    console.log('Inserting menu items...');
    const menuItems = getMenuItemsTemplate(restaurantsDict);
    await MenuItem.insertMany(menuItems);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedDatabase();
