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

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Serial</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-2">{order.serialNo ?? order._id.slice(-6)}</td>
                <td className="p-2">{order.userId?.name || "—"}</td>
                <td className="p-2">
                  <div className="text-xs max-w-xs">{order.shippingAddress || "—"}</div>
                  <div className="text-xs text-gray-500">{order.userId?.address?.phone || ""}</div>
                </td>
                <td className="p-2 text-center">₹{order.totalAmount}</td>
                <td className="p-2 text-center text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                  <div className={`mt-1 font-semibold ${order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.status}
                  </div>
                </td>
                <td className="p-2 text-center">
                  <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="p-1 border rounded">
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="issue">issue</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
