import Coupon from "../models/coupon.js";

// @desc   Create a new coupon (Admin only)
// @route  POST /api/admin/coupons
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      usagePerUser,
      validFrom,
      validUntil,
      isActive,
    } = req.body;

    // Validation
    if (!code || !discountType || !discountValue || !validUntil) {
      return res.status(400).json({
        message: "Code, discountType, discountValue, and validUntil are required",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    // Validate discount value
    if (discountType === "percentage" && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ message: "Percentage discount must be between 0 and 100" });
    }

    if (discountValue <= 0) {
      return res.status(400).json({ message: "Discount value must be greater than 0" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount,
      usageLimit,
      usagePerUser: usagePerUser || 1,
      validFrom: validFrom || Date.now(),
      validUntil,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all coupons (Admin only)
// @route  GET /api/admin/coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 20 } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Coupon.countDocuments(query);

    res.json({
      coupons,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCoupons: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single coupon by ID (Admin only)
// @route  GET /api/admin/coupons/:id
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update coupon (Admin only)
// @route  PUT /api/admin/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      usagePerUser,
      validFrom,
      validUntil,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // If code is being changed, check for duplicates
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      coupon.code = code.toUpperCase();
    }

    // Validate percentage discount
    if (discountType === "percentage" && discountValue && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ message: "Percentage discount must be between 0 and 100" });
    }

    // Update fields
    if (description !== undefined) coupon.description = description;
    if (discountType) coupon.discountType = discountType;
    if (discountValue) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (usagePerUser !== undefined) coupon.usagePerUser = usagePerUser;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (isActive !== undefined) coupon.isActive = isActive;

    const updatedCoupon = await coupon.save();

    res.json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete coupon (Admin only)
// @route  DELETE /api/admin/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Validate and apply coupon (Public - for users)
// @route  POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, userId, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ message: "Coupon code and order amount are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is no longer active" });
    }

    // Check validity dates
    const now = new Date();
    if (now < new Date(coupon.validFrom)) {
      return res.status(400).json({ message: "This coupon is not yet valid" });
    }
    if (now > new Date(coupon.validUntil)) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required to use this coupon`,
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "This coupon has reached its usage limit" });
    }

    // Check per-user usage limit (if userId is provided)
    if (userId) {
      const userUsage = coupon.usedBy.find((u) => u.userId.toString() === userId.toString());
      if (userUsage && userUsage.usedCount >= coupon.usagePerUser) {
        return res.status(400).json({
          message: "You have already used this coupon the maximum number of times",
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      // Apply max discount cap if set
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      // Fixed discount
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    const finalAmount = orderAmount - discountAmount;

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Apply coupon to order (called when order is created)
// @route  Internal function - called from order controller
export const applyCouponToOrder = async (code, userId, orderAmount) => {
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid or inactive coupon");
    }

    const now = new Date();
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
      throw new Error("Coupon is not valid at this time");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount of Rs. ${coupon.minOrderAmount} required`);
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    if (userId) {
      const userUsage = coupon.usedBy.find((u) => u.userId.toString() === userId.toString());
      if (userUsage && userUsage.usedCount >= coupon.usagePerUser) {
        throw new Error("User has exceeded coupon usage limit");
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    // Update coupon usage
    coupon.usageCount += 1;

    if (userId) {
      const userIndex = coupon.usedBy.findIndex((u) => u.userId.toString() === userId.toString());
      if (userIndex >= 0) {
        coupon.usedBy[userIndex].usedCount += 1;
      } else {
        coupon.usedBy.push({ userId, usedCount: 1 });
      }
    }

    await coupon.save();

    return {
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100,
      couponDetails: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    };
  } catch (error) {
    throw error;
  }
};


