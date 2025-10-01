import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AccountPage(){
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [address, setAddress] = useState(()=>{
    try{ const raw = window.localStorage.getItem('shippingAddress'); return raw? JSON.parse(raw) : {}; }catch{return {}} 
  });

  useEffect(()=>{
    if(tab==='orders' && user?._id){
      (async()=>{
        try{ const { data } = await api.get(`/orders/user/${user._id}`); setOrders(data||[]); }catch{}
      })();
    }
    if(tab==='payments' && user?._id){
      (async()=>{
        try{ const { data } = await api.get(`/payments/user/${user._id}`); setPayments(data||[]); }catch{}
      })();
    }
  },[tab,user?._id]);

  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', address: address||{} });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const saveProfile = async () => {
    try{
      setSaving(true); setMessage('');
      const { data } = await api.put(`/users/${user._id}`, { name: form.name, email: form.email, address: form.address });
      window.localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setMessage('Saved successfully');
    }catch(e){ setMessage(e?.response?.data?.message||'Failed to save'); }
    finally{ setSaving(false); }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Account</h1>
      <div className="flex gap-3 border-b mb-6">
        <button className={`px-3 py-2 ${tab==='profile'?'border-b-2 border-black':''}`} onClick={()=>setTab('profile')}>Profile</button>
        <button className={`px-3 py-2 ${tab==='orders'?'border-b-2 border-black':''}`} onClick={()=>setTab('orders')}>Orders</button>
        <button className={`px-3 py-2 ${tab==='payments'?'border-b-2 border-black':''}`} onClick={()=>setTab('payments')}>Payments</button>
      </div>

      {tab==='profile' && (
        <div className="space-y-3 max-w-xl">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="border p-2 rounded w-full" />
          </div>
          <div>
            <h3 className="font-semibold">Address</h3>
            <div className="grid grid-cols-1 gap-2">
              <input placeholder="Full Name" value={form.address.name||''} onChange={e=>setForm({...form, address:{...form.address, name:e.target.value}})} className="border p-2 rounded" />
              <input placeholder="Street" value={form.address.street||''} onChange={e=>setForm({...form, address:{...form.address, street:e.target.value}})} className="border p-2 rounded" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="City" value={form.address.city||''} onChange={e=>setForm({...form, address:{...form.address, city:e.target.value}})} className="border p-2 rounded" />
                <input placeholder="ZIP" value={form.address.zip||''} onChange={e=>setForm({...form, address:{...form.address, zip:e.target.value}})} className="border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Country" value={form.address.country||''} onChange={e=>setForm({...form, address:{...form.address, country:e.target.value}})} className="border p-2 rounded" />
                <input placeholder="Phone" value={form.address.phone||''} onChange={e=>setForm({...form, address:{...form.address, phone:e.target.value}})} className="border p-2 rounded" />
              </div>
            </div>
          </div>
          {message && <div className="text-sm text-gray-600">{message}</div>}
          <button disabled={saving} onClick={saveProfile} className="px-4 py-2 bg-black text-white rounded">
            {saving? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {tab==='orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600 mb-2">No orders found</p>
              <p className="text-gray-500 mb-6">Your order history will appear here</p>
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="border rounded-lg p-6 bg-white shadow-sm">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">Rs. {order.totalAmount}</div>
                    <div className={`text-sm px-3 py-1 rounded-full font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Products Ordered</h4>
                  <div className="space-y-3">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate(`/products/${product.productId._id}`)}
                        >
                          <img
                            src={product.productId.image || "https://placehold.co/200x200?text=No+Image"}
                            alt={product.productId.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 
                            className="font-medium text-gray-900 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={() => navigate(`/products/${product.productId._id}`)}
                          >
                            {product.productId.name}
                          </h5>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">Rs. {product.productId.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">Rs. {product.productId.price * product.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Payment:</span> {order.payment?.status || 'pending'} 
                    {order.payment?.method && ` via ${order.payment.method}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.payment?.paymentId && (
                      <span>ID: {order.payment.paymentId.slice(-8)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab==='payments' && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-lg text-gray-600 mb-2">No payment receipts found</p>
              <p className="text-gray-500">Your payment receipts will appear here after successful purchases</p>
            </div>
          ) : (
            payments.map(payment => (
              <div key={payment._id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Receipt</h3>
                    <p className="text-sm text-gray-500">Receipt: {payment.receipt}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">Rs. {payment.amount}</div>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Payment ID:</span> {payment.paymentId}</p>
                      <p><span className="text-gray-600">Method:</span> {payment.method}</p>
                      <p><span className="text-gray-600">Date:</span> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">{payment.shippingAddress}</p>
                  </div>
                </div>
                
                {payment.items && payment.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items Purchased</h4>
                    <div className="space-y-2">
                      {payment.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-gray-900">Rs. {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AccountPage;


