import express from "express";
import dotenv from "dotenv";
import connectDB from "./middlewares/config/db.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration - Support both development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  process.env.ADMIN_FRONTEND_URL,
  process.env.USER_FRONTEND_URL,
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // for JSON body parsing
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

// Public Routes for user-frontend
app.use("/api", publicRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "TIROS API is running...",
    version: "1.0.0",
    status: "healthy",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Railway/Render
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test CORS endpoint
app.get("/test-cors", (req, res) => {
  res.json({ 
    message: "CORS is working!", 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));