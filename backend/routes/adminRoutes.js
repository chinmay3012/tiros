import express from "express";
import { 
  registerAdmin, 
  loginAdmin, 
  logoutAdmin, 
  getAdminProfile, 
  updateAdminProfile
} from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes
router.post("/auth/logout", protectAdmin, logoutAdmin);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

export default router;
