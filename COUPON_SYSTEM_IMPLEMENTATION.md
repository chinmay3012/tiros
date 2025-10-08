# Coupon System Implementation Guide

## Overview
A complete coupon code system has been implemented for the TOPSHOT e-commerce platform. This allows admins to create and manage discount coupons, and users to apply them during checkout.

---

## 🎯 Features Implemented

### Admin Features
- ✅ Create new coupons with flexible discount options
- ✅ Edit existing coupons
- ✅ Delete coupons
- ✅ View all coupons with status indicators
- ✅ Support for percentage and fixed-amount discounts
- ✅ Set validity periods (from/until dates)
- ✅ Configure usage limits (total and per-user)
- ✅ Set minimum order amounts
- ✅ Set maximum discount caps (for percentage discounts)
- ✅ Activate/deactivate coupons

### User Features
- ✅ Apply coupon codes during checkout
- ✅ Real-time coupon validation
- ✅ View discount amount before placing order
- ✅ Remove applied coupons
- ✅ Clear error messages for invalid/expired coupons

---

## 📁 Files Created/Modified

### Backend Files

#### New Files:
1. **`backend/models/coupon.js`**
   - Mongoose schema for coupons
   - Fields: code, description, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, usagePerUser, validFrom, validUntil, isActive, usedBy, etc.

2. **`backend/controllers/couponController.js`**
   - `createCoupon` - Create new coupon (Admin)
   - `getAllCoupons` - List all coupons with pagination (Admin)
   - `getCouponById` - Get single coupon details (Admin)
   - `updateCoupon` - Update coupon (Admin)
   - `deleteCoupon` - Delete coupon (Admin)
   - `validateCoupon` - Validate coupon code (Public)
   - `applyCouponToOrder` - Apply coupon when creating order (Internal)

3. **`backend/routes/couponRoutes.js`**
   - Admin routes (protected): POST, GET, PUT, DELETE `/api/admin/coupons`
   - Public route: POST `/api/coupons/validate`

#### Modified Files:
1. **`backend/server.js`**
   - Imported couponRoutes
   - Added routes: `/api/admin/coupons` and `/api/coupons`

2. **`backend/models/order.js`**
   - Added `coupon` field (code, discountType, discountValue, discountAmount)
   - Added `finalAmount` field

3. **`backend/controllers/publicOrderController.js`**
   - Updated `createOrder` to accept `couponCode`
   - Integrated coupon validation and application
   - Updated payment amount to use final amount after discount

### Frontend Files

#### Admin Panel:

1. **`TOPSHOT/src/admin/pages/Coupons.jsx`** (New)
   - Beautiful card-based coupon display
   - Create/Edit coupon modal
   - Delete functionality
   - Status badges (Active/Inactive/Expired)
   - Visual discount display

2. **`TOPSHOT/src/App.jsx`**
   - Added Coupons page route
   - Imported Coupons component

3. **`TOPSHOT/src/admin/AdminLayout.jsx`**
   - Added "Coupons" to navigation menu with TicketIcon

#### User Frontend:

1. **`user-frontend/src/pages/CheckoutPage.jsx`**
   - Added coupon code input field
   - Apply/Remove coupon buttons
   - Discount amount display
   - Updated total calculation
   - Error handling for invalid coupons

2. **`user-frontend/src/context/CartContext.jsx`**
   - Updated `checkout` function to accept `couponCode` parameter
   - Pass couponCode to order creation API

---

## 🔧 Database Schema

### Coupon Collection
```javascript
{
  code: String (unique, uppercase),
  description: String,
  discountType: "percentage" | "fixed",
  discountValue: Number,
  minOrderAmount: Number (default: 0),
  maxDiscountAmount: Number (optional),
  usageLimit: Number (optional),
  usageCount: Number (default: 0),
  usagePerUser: Number (default: 1),
  usedBy: [{ userId: ObjectId, usedCount: Number }],
  validFrom: Date,
  validUntil: Date (required),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Order Collection (Updated)
```javascript
{
  // ... existing fields ...
  coupon: {
    code: String,
    discountType: String,
    discountValue: Number,
    discountAmount: Number
  },
  finalAmount: Number
}
```

---

## 🚀 Usage Instructions

### For Admins:

1. **Navigate to Admin Panel** → Coupons
2. **Create a Coupon**:
   - Click "Create Coupon"
   - Enter coupon code (e.g., "SAVE20")
   - Select discount type (Percentage or Fixed)
   - Enter discount value
   - Set optional parameters (min order, max discount, usage limits)
   - Set validity period
   - Click "Create"

3. **Manage Coupons**:
   - Edit: Click the pencil icon
   - Delete: Click the trash icon
   - View usage statistics on each card

### For Users:

1. **Add items to cart** and go to checkout
2. **Enter coupon code** in the "Have a coupon code?" field
3. **Click "Apply"** to validate and apply the coupon
4. **View discount** amount and updated total
5. **Proceed with payment** - the discounted amount will be charged

---

## 🎨 UI Features

### Admin Panel:
- **Beautiful card layout** with gradient backgrounds
- **Color-coded status badges**:
  - Green: Active coupons
  - Red: Expired coupons
  - Gray: Inactive coupons
- **Visual discount display** with icons
- **Usage statistics** (used/total)
- **Responsive design** (works on mobile, tablet, desktop)

### User Checkout:
- **Clean coupon input** with uppercase formatting
- **Real-time validation** with loading states
- **Success indicator** with green background
- **Clear error messages** for invalid codes
- **Discount breakdown** showing savings
- **Remove button** to clear applied coupon

---

## ⚙️ Validation Rules

The system validates:
1. ✅ Coupon code exists
2. ✅ Coupon is active
3. ✅ Current date is within validity period
4. ✅ Order amount meets minimum requirement
5. ✅ Total usage limit not exceeded
6. ✅ Per-user usage limit not exceeded
7. ✅ Discount doesn't exceed order total

---

## 🔒 Security Features

- **Admin-only routes** protected with authentication middleware
- **Server-side validation** of all coupon applications
- **Usage tracking** to prevent abuse
- **Atomic updates** when applying coupons to orders
- **Error handling** for all edge cases

---

## 📊 Example Coupon Scenarios

### Scenario 1: Percentage Discount
- Code: `SAVE20`
- Type: Percentage
- Value: 20%
- Min Order: Rs. 500
- Max Discount: Rs. 200
- Result: 20% off on orders above Rs. 500, capped at Rs. 200

### Scenario 2: Fixed Discount
- Code: `FLAT100`
- Type: Fixed
- Value: Rs. 100
- Min Order: Rs. 200
- Result: Rs. 100 off on orders above Rs. 200

### Scenario 3: Limited Use
- Code: `FIRSTBUY`
- Type: Percentage
- Value: 15%
- Usage Limit: 100 total uses
- Usage Per User: 1
- Result: First 100 users get 15% off (one-time use)

---

## 🧪 Testing the System

### Test as Admin:
1. Login to admin panel
2. Navigate to Coupons page
3. Create a test coupon (e.g., "TEST50" for 50% off)
4. Verify it appears in the list
5. Edit and delete functionality

### Test as User:
1. Add products to cart
2. Go to checkout
3. Try invalid coupon → Should show error
4. Apply valid coupon → Should show discount
5. Complete order → Coupon usage should increment

---

## 🎉 Success Indicators

The system is working correctly when:
- ✅ Admins can create/edit/delete coupons without errors
- ✅ Users can apply valid coupons and see discounts
- ✅ Invalid/expired coupons show appropriate errors
- ✅ Orders are created with correct final amounts
- ✅ Coupon usage counts increment properly
- ✅ Usage limits are enforced

---

## 📝 Notes

- All coupon codes are automatically converted to **UPPERCASE**
- Discounts are rounded to 2 decimal places
- The system prevents discounts from exceeding order totals
- Expired coupons are visually indicated but not automatically deleted
- Admin can manually deactivate coupons without deleting them

---

## 🔮 Future Enhancements (Optional)

Consider adding:
- Category-specific coupons
- Product-specific coupons
- First-time user coupons
- Bulk coupon generation
- Coupon analytics dashboard
- Email coupon codes to users
- Auto-apply best available coupon

---

**Implementation Date**: October 2025  
**Status**: ✅ Complete and Ready for Production

