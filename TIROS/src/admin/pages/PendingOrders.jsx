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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
      <div className="grid grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o._id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold mb-2 flex justify-between">
              <span>#{o.serialNo ?? o._id.slice(-6)}</span>
              <span className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mb-1 text-sm font-medium">Customer: {o.userId?.name || "—"}</div>
            <div className="mb-1 text-xs text-gray-600">Phone: {o.userId?.address?.phone || "—"}</div>
            <div className="mb-2 text-xs text-gray-500 line-clamp-2">Address: {o.shippingAddress || "—"}</div>
            <div className="mb-1 text-sm">Amount: ₹{o.totalAmount}</div>
            <div className="mb-3 text-sm">Items: {o.products?.length}</div>
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" onChange={() => markShipped(o._id)} className="mr-2" />
                Mark shipped
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
