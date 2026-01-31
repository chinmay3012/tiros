import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OrderConfirmationPopup from "../components/OrderConfirmationPopup";
import api from "../api/axios";

function CheckoutPage() {
  const { cartItems, checkout, syncCartWithProducts } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Sync cart with current product data when page loads
  useEffect(() => {
    if (cartItems.length > 0) {
      setSyncing(true);
      syncCartWithProducts().finally(() => setSyncing(false));
    }
  }, []); // Only run on mount

  const [address, setAddress] = useState({ name:"", street:"", city:"", zip:"", country:"", phone:"" });
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Load address from API if user is logged in, or from localStorage if not
  useEffect(() => {
    const loadAddress = async () => {
      setLoadingAddress(true);
      try {
        if (user?._id) {
          // User is logged in - load from API
          const response = await api.get(`/users/${user._id}`);
          const userAddress = response.data.address || {};
          setAddress({
            name: userAddress.name || "",
            street: userAddress.street || "",
            city: userAddress.city || "",
            zip: userAddress.zip || "",
            country: userAddress.country || "",
            phone: userAddress.phone || ""
          });
        } else {
          // User not logged in - load from localStorage
          try {
            const raw = window.localStorage.getItem('shippingAddress');
            setAddress(raw ? JSON.parse(raw) : { name:"", street:"", city:"", zip:"", country:"", phone:"" });
          } catch (error) {
            setAddress({ name:"", street:"", city:"", zip:"", country:"", phone:"" });
          }
        }
      } catch (error) {
        console.error("Error loading address:", error);
        // Fallback to localStorage
        try {
          const raw = window.localStorage.getItem('shippingAddress');
          setAddress(raw ? JSON.parse(raw) : { name:"", street:"", city:"", zip:"", country:"", phone:"" });
        } catch (e) {
          setAddress({ name:"", street:"", city:"", zip:"", country:"", phone:"" });
        }
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddress();
  }, [user?._id]);

  // Save address to API or localStorage when it changes
  const saveAddress = async (addressData) => {
    try {
      if (user?._id) {
        // User is logged in - save to API
        await api.put(`/users/${user._id}/address`, { address: addressData });
      } else {
        // User not logged in - save to localStorage
        window.localStorage.setItem('shippingAddress', JSON.stringify(addressData));
      }
    } catch (error) {
      console.error("Error saving address:", error);
      // Fallback to localStorage
      try {
        window.localStorage.setItem('shippingAddress', JSON.stringify(addressData));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  };
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const getCartTotal = () => {
    return cartItems
      .filter((item) => !item.status || item.status !== 'sold_out')
      .reduce((sum, item) => {
        const price = parseFloat(
          String(item.price).replace("Rs. ", "").replace(",", "")
        );
        return sum + price * item.quantity;
      }, 0);
  };

  const getFinalTotal = () => {
    const total = getCartTotal();
    if (appliedCoupon) {
      return appliedCoupon.finalAmount;
    }
    return total;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        userId: user?._id,
        orderAmount: getCartTotal(),
      });

      setAppliedCoupon(response.data);
      setCouponError("");
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleOrderConfirmationClose = () => {
    setShowOrderConfirmation(false);
    navigate('/orders');
  };

  const handleAddressChange = (field, value) => {
    setAddress({...address, [field]: value});
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateAddress = () => {
    const requiredFields = ['name', 'street', 'city', 'zip', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !address[field] || address[field].trim() === '');
    
    if (missingFields.length > 0) {
      const fieldLabels = {
        name: 'Full Name',
        street: 'Street Address', 
        city: 'City',
        zip: 'ZIP Code',
        country: 'Country',
        phone: 'Phone Number'
      };
      const missingFieldNames = missingFields.map(field => fieldLabels[field]).join(', ');
      setError(`Please fill in all required fields: ${missingFieldNames}`);
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    try{
      setPlacing(true);
      setError("");
      
      // Validate address before proceeding
      if (!validateAddress()) {
        setPlacing(false);
        return;
      }
      
      await saveAddress(address);

      // PhonePe: webhook-primary flow - create order (pending) then initiate, then redirect
      const totalPaisa = Math.round(getFinalTotal() * 100);
      const initRes = await api.post("/payments/phonepe/initiate", {
        amountInPaisa: totalPaisa,
        redirectUrl: `${window.location.origin}/checkout/return`,
      });
      const redirectUrl = initRes.data?.redirectUrl;
      const merchantOrderId = initRes.data?.merchantOrderId;
      if (redirectUrl && merchantOrderId) {
        await checkout({
          address,
          payment: {
            paymentId: merchantOrderId,
            status: "pending",
            method: "phonepe",
            amount: getFinalTotal(),
          },
          couponCode: appliedCoupon ? appliedCoupon.coupon.code : undefined,
        });
        window.location.href = redirectUrl;
        return;
      }
      setError("Could not start payment. Please try again.");
    }catch(err){
      const msg = err?.response?.data?.message || err?.message;
      setError(msg || "Failed to place order");
    }finally{
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Checkout</h1>
      {syncing && (
        <div className="max-w-xl mx-auto mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 text-center">
          Updating cart with latest product information...
        </div>
      )}
      <div className="max-w-xl mx-auto border p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>Rs. {getCartTotal().toFixed(2)}</span>
          </div>
          
          {/* Coupon Section */}
          <div className="py-3 border-t border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Have a coupon code?
            </label>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md uppercase"
                  disabled={validatingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 hover:bg-[#95C5F4]"
                >
                  {validatingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-green-800">
                      {appliedCoupon.coupon.code} Applied!
                    </div>
                    {appliedCoupon.coupon.description && (
                      <div className="text-sm text-green-600">
                        {appliedCoupon.coupon.description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-[#95C5F4]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {couponError && (
              <p className="text-red-600 text-sm mt-2">{couponError}</p>
            )}
          </div>

          {appliedCoupon && (
            <div className="flex justify-between py-2 text-green-600">
              <span>Discount:</span>
              <span>- Rs. {appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between py-2 font-semibold text-lg border-t">
            <span>Total:</span>
            <span>Rs. {getFinalTotal().toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <h3 className="text-lg font-semibold">Shipping Address <span className="text-red-500">*</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input 
              className={`border p-2 rounded w-full ${!address.name && error ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Enter your full name" 
              value={address.name} 
              onChange={e=>handleAddressChange('name', e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
            <input 
              className={`border p-2 rounded w-full ${!address.street && error ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Enter street address" 
              value={address.street} 
              onChange={e=>handleAddressChange('street', e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <input 
                className={`border p-2 rounded w-full ${!address.city && error ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="City" 
                value={address.city} 
                onChange={e=>handleAddressChange('city', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code <span className="text-red-500">*</span></label>
              <input 
                className={`border p-2 rounded w-full ${!address.zip && error ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="ZIP Code" 
                value={address.zip} 
                onChange={e=>handleAddressChange('zip', e.target.value)} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
              <input 
                className={`border p-2 rounded w-full ${!address.country && error ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Country" 
                value={address.country} 
                onChange={e=>handleAddressChange('country', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input 
                className={`border p-2 rounded w-full ${!address.phone && error ? 'border-red-500' : 'border-gray-300'}`} 
                placeholder="Phone Number" 
                value={address.phone} 
                onChange={e=>handleAddressChange('phone', e.target.value)} 
              />
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <button onClick={handlePlaceOrder} disabled={placing} className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 hover:bg-[#95C5F4]">
          {placing ? "Placing..." : "Place Order"}
        </button>
      </div>

      {/* Order Confirmation Popup */}
      <OrderConfirmationPopup 
        isVisible={showOrderConfirmation}
        onClose={handleOrderConfirmationClose}
      />
    </div>
  );
}

export default CheckoutPage;
