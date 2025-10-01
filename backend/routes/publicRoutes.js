import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/publicAuthController.js";
import { listProducts, getProduct, listCategories } from "../controllers/publicCatalogController.js";
import { createOrder, listUserOrders } from "../controllers/publicOrderController.js";

const router = express.Router();

// Auth
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", getProfile);
router.put("/users/:id", updateProfile);

// Catalog
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.get("/categories", listCategories);

// Orders
router.post("/orders", createOrder);
router.get("/orders/user/:id", listUserOrders);

export default router;


