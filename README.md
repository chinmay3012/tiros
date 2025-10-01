# TIROS - E-commerce Platform

A modern, full-stack e-commerce platform built with MERN stack, featuring a React frontend with Tailwind CSS and a Node.js/Express backend with MongoDB.

## Features

### Frontend (React + Tailwind CSS)
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: User registration, login, and protected routes
- **Product Management**: Product listing, search, filtering, and detailed views
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Wishlist**: Save favorite products for later
- **Order Management**: Order placement, tracking, and history
- **User Profile**: Account management and order history
- **Responsive Design**: Mobile-first approach with desktop optimization

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication with secure cookies
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations for products and categories
- **Cart System**: Persistent cart with MongoDB integration
- **Order Processing**: Order creation, status tracking, and management
- **Admin Panel**: Complete admin interface for managing the platform

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Cookie Parser

## Project Structure

```
TIROS/
├── backend/
│   ├── controllers/          # API route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middlewares/         # Authentication and other middleware
│   └── server.js            # Express server setup
├── TIROS/                   # React frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Context for state management
│   │   ├── services/       # API service functions
│   │   └── App.jsx         # Main App component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── package.json            # Backend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/tiros
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd TIROS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Database Setup

1. **Local MongoDB**: Ensure MongoDB is running locally
2. **MongoDB Atlas**: Update the `MONGODB_URI` in your `.env` file with your Atlas connection string

### Admin Setup

To create an admin user, run the `add-admin.js` script:
```bash
node add-admin.js
```

## API Endpoints

### User Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id/related` - Get related products
- `GET /api/products/categories` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:productId` - Remove item from wishlist
- `GET /api/wishlist/:productId` - Check if item is in wishlist

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard/summary` - Dashboard summary
- `GET /api/admin/products` - Admin product management
- `GET /api/admin/orders` - Admin order management
- `GET /api/admin/users` - Admin user management
- And more...

## Features Overview

### User Features
- Browse and search products
- Filter products by category, price, etc.
- Add products to cart and wishlist
- Secure checkout process
- Order tracking and history
- User profile management

### Admin Features
- Complete dashboard with analytics
- Product management (CRUD)
- Order management and status updates
- User management
- Inventory tracking
- Category management
- Sales reports

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend:
   ```bash
   cd TIROS
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service

### Backend (Railway/Heroku)
1. Set up environment variables on your hosting platform
2. Deploy the backend code
3. Update frontend API URLs to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@tiros.com or create an issue in the repository.
