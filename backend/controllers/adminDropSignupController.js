import DropSignup from "../models/dropSignup.js";

// Get all drop signups
export const getAllDropSignups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await DropSignup.countDocuments();
    const dropSignups = await DropSignup.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: {
        dropSignups,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    console.error("Get drop signups error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch drop signups" 
    });
  }
};

// Delete a drop signup
export const deleteDropSignup = async (req, res) => {
  try {
    const { id } = req.params;

    const dropSignup = await DropSignup.findByIdAndDelete(id);
    
    if (!dropSignup) {
      return res.status(404).json({ 
        success: false,
        message: "Drop signup not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Drop signup deleted successfully"
    });
  } catch (error) {
    console.error("Delete drop signup error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to delete drop signup" 
    });
  }
};

// Get total count of drop signups
export const getDropSignupStats = async (req, res) => {
  try {
    const total = await DropSignup.countDocuments();
    
    // Get signups from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = await DropSignup.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return res.status(200).json({
      success: true,
      data: {
        total,
        recent: recentSignups
      }
    });
  } catch (error) {
    console.error("Get drop signup stats error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch drop signup stats" 
    });
  }
};

