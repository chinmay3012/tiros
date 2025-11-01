import express from "express";
import { submitDropSignup } from "../controllers/dropSignupController.js";

const router = express.Router();

// Public route: Submit email for drops
router.post("/", submitDropSignup);

export default router;

