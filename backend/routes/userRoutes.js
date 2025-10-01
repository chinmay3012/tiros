import express from "express";
import { 
  getAllUsers, 
  getUserById, 
  toggleUserBlock, 
  deleteUser 
} from "../controllers/userController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All user management routes require admin authentication
router.get("/", protectAdmin, getAllUsers);
router.get("/:id", protectAdmin, getUserById);
router.put("/:id/block", protectAdmin, toggleUserBlock);
router.delete("/:id", protectAdmin, deleteUser);

export default router;
