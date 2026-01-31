# TOPSHOT - E-commerce Platform

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
TOPSHOT/
├── backend/
│   ├── controllers/          # API route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middlewares/         # Authentication and other middleware
│   └── server.js            # Express server setup
├── TOPSHOT/                   # React frontend
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
   cd TOPSHOT
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

All routes are served from the Express app (`backend/server.js`). When running locally the base URL is `http://localhost:3001`. In production we host on Render/Railway and expose the same `/api` namespace.

### Public & Customer-Facing

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/users/register` | Create a shopper account | None |
| POST | `/api/users/login` | Authenticate and receive JWT | None |
| GET | `/api/users/:id` | Fetch profile | Bearer |
| PUT | `/api/users/:id` | Update profile | Bearer |
| GET | `/api/products` | List products (`search`, `section`, `limit` supported) | None |
| GET | `/api/products/:id` | Get single product | None |
| GET | `/api/categories` | List categories for navigation | None |
| POST | `/api/orders` | Create an order from cart payload | Bearer |
| GET | `/api/orders/user/:id` | Fetch orders for a user | Bearer |
| POST | `/api/dropsignups` | Subscribe to upcoming drops | None |
| POST | `/api/payments` | Create payment intent | Bearer |
| POST | `/api/payments/verify` | Payment verification (PhonePe, etc.) | Bearer |
| GET | `/api/payments/user/:userId` | Logged-in user payment history | Bearer |
| POST | `/api/coupons/validate` | Validate a coupon code at checkout | None |

> Tip: The `publicRoutes` module consolidates auth, catalog and order endpoints, so you can inspect `backend/routes/publicRoutes.js` to see request/response shapes.

### Admin APIs (require Admin JWT via `protectAdmin`)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/admin/register` | Create an admin (bootstrap script also available) |
| POST | `/api/admin/login` | Admin authentication |
| POST | `/api/admin/auth/logout` | Invalidate current admin session |
| GET/PUT | `/api/admin/profile` | View or update admin profile |
| CRUD | `/api/admin/users` | Manage shopper accounts (`block`, `delete`) |
| CRUD | `/api/admin/products` | Product catalog management with Cloudinary uploads |
| CRUD | `/api/admin/categories` | Category + subcategory management |
| GET/PUT | `/api/admin/inventory` | Low-stock alerts & manual stock overrides |
| GET/PUT | `/api/admin/orders` | Review orders, update fulfillment status |
| GET | `/api/admin/dashboard/*` | KPI summaries, sales and user reports |
| CRUD | `/api/admin/coupons` | Marketing coupon lifecycle |
| GET/DELETE | `/api/admin/dropsignups` | View or purge drop signup leads |

All admin routes are mounted under the `/api/admin` prefix inside `server.js`, so you can plug the same base URL into Postman and share an Admin JWT to exercise the entire back office.

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
   cd TOPSHOT
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

For support, email support@topshot.com or create an issue in the repository.
