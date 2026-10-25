# Food Delivery App

A complete full-stack Food Delivery Application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `frontend/`: React + Vite application containing the user interface, routing, context-based cart state, and API integration.
- `backend/`: Node.js + Express application containing MongoDB models, RESTful controllers, routing, and centralized error handling.

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Server running locally on port 27017 (`mongodb://localhost:27017`)
- MongoDB Compass (optional, for inspecting data)

## Getting Started

### 1. Database Setup & Seeding

First, ensure your local MongoDB is running. Then navigate to the backend directory, install dependencies, and run the seed script to populate restaurants and menus.

```bash
cd backend
npm install
npm run seed
```

This will clear existing data and insert:
- 10 sample restaurants
- 30+ sample menu items spanning various cuisines and categories

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```
The backend API will run on `http://localhost:5000`.

### 3. Start the Frontend Application

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

---

## Architecture & Features

### Frontend (React)
- **Pages**: Home, Restaurants, Restaurant Details (with menu), Cart.
- **Routing**: `react-router-dom` handles client-side routing.
- **State Management**: React Context (`CartContext`) manages cart state globally.
- **API Integration**: Centralized Axios instance (`src/services/api.js`) pointing to `http://localhost:5000/api`.
- **Filtering**: Advanced filtering by Cuisine, Price, Food Type, and Category is passed to the backend via query parameters.

### Backend (Express + MongoDB)
- **Models**: `Restaurant`, `MenuItem`, `Cart`.
- **Cart Logic**: The `Cart` schema includes a `pre('save')` hook to automatically calculate `subtotal` for individual items and `totalAmount` for the entire cart.
- **Advanced Filtering**: The `/api/menu` endpoint accepts query strings (e.g., `?foodType=veg&maxPrice=300`) and constructs MongoDB queries dynamically.
- **Error Handling**: Centralized error middleware ensures consistent API responses.

---

## Postman API Testing Instructions

You can test the following endpoints in Postman. Use `http://localhost:5000` as your base URL.

### Health Check
- **GET** `/api/health` - Verifies the server is running.

### Restaurants
- **GET** `/api/restaurants` - Get all restaurants.
- **GET** `/api/restaurants/:id` - Get a specific restaurant by ID.

### Menu Items & Filtering
- **GET** `/api/menu` - Get all menu items.
- **GET** `/api/menu?foodType=veg` - Filter veg items.
- **GET** `/api/menu?foodType=non-veg` - Filter non-veg items.
- **GET** `/api/menu?minPrice=100&maxPrice=300` - Filter items by price range.
- **GET** `/api/menu?cuisine=Indian` - Filter items by cuisine.
- **GET** `/api/menu?category=Pizza` - Filter items by category.
- **GET** `/api/menu?search=chicken` - Search items by name.
- **GET** `/api/menu?foodType=veg&minPrice=100&maxPrice=300&cuisine=Indian` - Chain multiple filters together.

### Cart (Using user ID "user123")
- **GET** `/api/cart/user123` - Get the current user's cart.
- **POST** `/api/cart/user123/items` - Add item to cart.
  *Body (JSON):*
  ```json
  {
    "itemId": "<MENU_ITEM_ID>",
    "quantity": 2
  }
  ```
- **PUT** `/api/cart/user123/items/<ITEM_ID>` - Update cart item quantity.
  *Body (JSON):*
  ```json
  {
    "quantity": 3
  }
  ```
- **DELETE** `/api/cart/user123/items/<ITEM_ID>` - Remove an item from the cart.
- **DELETE** `/api/cart/user123` - Clear the entire cart.

---

## Common Errors and Solutions

1. **MongoDB Connection Failed (`MongoServerSelectionError`)**:
   - Ensure MongoDB is running locally on port 27017. If you use MongoDB Atlas or a different port, update the `MONGO_URI` in `backend/.env`.

2. **CORS Error (`Access-Control-Allow-Origin`)**:
   - The backend is configured to allow `http://localhost:5173`. If your React app runs on a different port (e.g., 5174), update the CORS settings in `backend/server.js`.

3. **Missing Data in Frontend**:
   - Make sure you have run the `npm run seed` command inside the `backend` folder to populate the database before opening the frontend.
