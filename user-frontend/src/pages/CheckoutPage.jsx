import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OrderConfirmationPopup from "../components/OrderConfirmationPopup";

function CheckoutPage() {
  const { cartItems, checkout } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [address, setAddress] = useState(()=>{
    try{
      const raw = window.localStorage.getItem('shippingAddress');
      return raw ? JSON.parse(raw) : { name:"", street:"", city:"", zip:"", country:"", phone:"" };
    }catch{return { name:"", street:"", city:"", zip:"", country:"", phone:"" }}
  });

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(
        String(item.price).replace("Rs. ", "").replace(",", "")
      );
      return sum + price * item.quantity;
    }, 0);
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

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
      
      window.localStorage.setItem('shippingAddress', JSON.stringify(address));
      // Razorpay flow
      const loaded = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
      if(!loaded){ throw new Error('Failed to load Razorpay'); }
      const totalAmount = getCartTotal();
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "TIROS Store",
        description: "Order Payment",
        handler: async (response) => {
          try{
            await checkout({ address, payment: { paymentId: response.razorpay_payment_id, status: 'paid', method: 'razorpay', amount: totalAmount } });
            setShowOrderConfirmation(true);
          }catch(e){ setError('Failed to finalize order'); }
        },
        theme: { color: "#000000" }
      });
      rzp.open();
    }catch(err){
      setError("Failed to place order");
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
      <div className="max-w-xl mx-auto border p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between py-2 border-b">
          <span>Total:</span>
          <span>Rs. {getCartTotal().toFixed(2)}</span>
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
        <button onClick={handlePlaceOrder} disabled={placing} className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
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
