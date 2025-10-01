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

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179'], // Support dev ports
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow common headers
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
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
  res.send("API is running...");
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