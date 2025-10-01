import User from "../models/user.js";

// @desc   Get all users with filters
// @route  GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, blocked } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Blocked filter
    if (blocked !== undefined) {
      query.isBlocked = blocked === "true";
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalUsers: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single user details
// @route  GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Block/unblock a user
// @route  PUT /api/admin/users/:id/block
export const toggleUserBlock = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.isBlocked = isBlocked;
    await user.save();
    
    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
