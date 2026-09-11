import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        // Reactivate inactive user or tell them to contact support
        return res.status(400).json({ message: "Account is deactivated. Please contact support." });
      }
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password, isActive: true });
    return res.status(201).json({
      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
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
    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is deactivated. Please contact support." });
    }
    const token = signToken(user._id);
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address || null,
        cart: user.cart || [],
        wishlist: user.wishlist || []
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = typeof email === "string" ? email.trim().toLowerCase() : email;
    if (address !== undefined) updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ _id: user._id, name: user.name, email: user.email, address: user.address || null });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

// Cart Management
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('cart');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ cart: user.cart || [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { cart: cart || [] } },
      { new: true }
    ).select("cart");
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Wishlist Management
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const { wishlist } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { wishlist: wishlist || [] } },
      { new: true }
    ).select("wishlist");
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Address Management
export const updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { address: address || {} } },
      { new: true }
    ).select("address");
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ address: user.address || null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


