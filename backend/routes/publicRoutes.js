import express from "express";
import { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile,
  getCart,
  updateCart,
  getWishlist,
  updateWishlist,
  updateAddress
} from "../controllers/publicAuthController.js";
import { listProducts, getProduct, listCategories } from "../controllers/publicCatalogController.js";
import { createOrder, listUserOrders, getOrderByPaymentId } from "../controllers/publicOrderController.js";

const router = express.Router();

// Auth
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", getProfile);
router.put("/users/:id", updateProfile);

// User Data Management
router.get("/users/:id/cart", getCart);
router.put("/users/:id/cart", updateCart);
router.get("/users/:id/wishlist", getWishlist);
router.put("/users/:id/wishlist", updateWishlist);
router.put("/users/:id/address", updateAddress);

// Catalog
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.get("/categories", listCategories);

// Orders
router.post("/orders", createOrder);
router.get("/orders/user/:id", listUserOrders);
router.get("/orders/payment/:paymentId", getOrderByPaymentId);

export default router;


