import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc   Register admin (disabled - admins must be added manually to database)
// @route  POST /api/admin/register
export const registerAdmin = async (req, res) => {
  res.status(403).json({ 
    message: "Admin registration is disabled. Please contact the system administrator to add your account." 
  });
};

// @desc   Login admin
// @route  POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Logout admin
// @route  POST /api/admin/auth/logout
export const logoutAdmin = async (req, res) => {
  try {
    // Since we're using JWT, logout is handled on the client side by removing the token
    // But we can add token blacklisting logic here if needed
    res.json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get admin profile
// @route  GET /api/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update admin profile
// @route  PUT /api/admin/profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const admin = await Admin.findById(req.admin._id);
    
    if (name) admin.name = name;
    if (email) {
      // Check if email is already taken by another admin
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already exists" });
      }
      admin.email = email;
    }
    
    const updatedAdmin = await admin.save();
    
    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

