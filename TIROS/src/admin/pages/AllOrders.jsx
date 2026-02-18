// src/admin/pages/AllOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/orders");
        setOrders(data.orders || data); // depends on backend shape
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      setOrders((prev) => prev.filter(o => o._id !== orderId));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Payment ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2">Price</th>
              <th className="p-2">Paid</th>
              <th className="p-2">Coupon</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-2">#{order.serialNo || (order._id ? String(order._id).slice(-8).toUpperCase() : 'N/A')}</td>
                <td className="p-2 text-xs font-mono text-gray-500">{order.payment?.paymentId || "—"}</td>
                <td className="p-2">{order.userId?.name || "—"}</td>
                <td className="p-2">
                  <div className="text-xs max-w-xs">{order.shippingAddress || "—"}</div>
                  <div className="text-xs text-gray-500">{order.userId?.address?.phone || ""}</div>
                  {order.payment?.paymentId && (
                    <div className="text-[10px] text-blue-600 font-mono mt-1">PID: {order.payment.paymentId}</div>
                  )}
                </td>
                <td className="p-2 text-center text-sm text-gray-500">₹{order.totalAmount}</td>
                <td className="p-2 text-center font-semibold">₹{order.finalAmount || order.totalAmount}</td>
                <td className="p-2 text-center text-xs">
                  {order.coupon?.code ? (
                    <span className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-200">{order.coupon.code}</span>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="p-2 text-center text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                  <div className={`mt-1 font-semibold ${order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.status}
                  </div>
                </td>
                <td className="p-2 text-center">
                  <div className="flex items-center space-x-2 justify-center">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="p-1 border rounded text-xs">
                      <option value="pending">pending</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="issue">issue</option>
                    </select>
                    <button onClick={() => deleteOrder(order._id)} className="text-red-500 hover:text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
