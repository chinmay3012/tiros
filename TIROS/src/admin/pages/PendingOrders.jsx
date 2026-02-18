// src/admin/pages/PendingOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/orders?status=pending");
        setOrders(data.orders || data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const markShipped = async (id) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: "shipped" });
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch { alert("Failed"); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await api.delete(`/admin/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch { alert("Failed to delete"); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
      <div className="grid grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o._id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold mb-2 flex justify-between">
              <span>#{o.serialNo || (o._id ? String(o._id).slice(-8).toUpperCase() : 'N/A')}</span>
              <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mb-1 text-sm font-medium">Customer: {o.userId?.name || "—"}</div>
            <div className="mb-1 text-xs text-gray-600">Phone: {o.userId?.address?.phone || "—"}</div>
            <div className="mb-2 text-xs text-gray-500 line-clamp-2">Address: {o.shippingAddress || "—"}</div>
            {o.payment?.paymentId && (
              <div className="mb-2 text-[10px] text-blue-600 font-mono">PID: {o.payment.paymentId}</div>
            )}
            <div className="flex flex-col mb-1 border-t pt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Original Price:</span>
                <span>₹{o.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Paid Amount:</span>
                <span>₹{o.finalAmount || o.totalAmount}</span>
              </div>
              {o.coupon?.code && (
                <div className="flex justify-between text-[10px] text-blue-600 font-medium italic mt-1">
                  <span>Coupon: {o.coupon.code}</span>
                  <span>-₹{o.coupon.discountAmount}</span>
                </div>
              )}
            </div>
            <div className="mb-3 text-sm text-gray-600">Items: {o.products?.length}</div>
            <div className="flex justify-between items-center">
              <label className="inline-flex items-center">
                <input type="checkbox" onChange={() => markShipped(o._id)} className="mr-2" />
                Mark shipped
              </label>
              <button onClick={() => deleteOrder(o._id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
