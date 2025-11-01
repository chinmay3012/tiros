import DropSignup from "../models/dropSignup.js";

// Public: Submit email for drop signups
export const submitDropSignup = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Check if email already exists
    const existing = await DropSignup.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "This email is already signed up" 
      });
    }

    // Create new signup
    const dropSignup = await DropSignup.create({ email: email.toLowerCase().trim() });

    return res.status(201).json({
      success: true,
      message: "Successfully signed up for drops!",
      data: dropSignup
    });
  } catch (error) {
    console.error("Drop signup error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to sign up for drops" 
    });
  }
};

