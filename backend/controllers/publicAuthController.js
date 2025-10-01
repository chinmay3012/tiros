import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password });
    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }
    const token = signToken(user._id);
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, address: user.address || null },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try{
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  }catch(error){ return res.status(500).json({ message: error.message }); }
};

export const updateProfile = async (req, res) => {
  try{
    const { name, email, address } = req.body;
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ message: 'User not found' });
    if(name!==undefined) user.name = name;
    if(email!==undefined) user.email = email;
    if(address!==undefined) user.address = address;
    await user.save();
    return res.json({ _id: user._id, name: user.name, email: user.email, address: user.address || null });
  }catch(error){ return res.status(500).json({ message: error.message }); }
};


