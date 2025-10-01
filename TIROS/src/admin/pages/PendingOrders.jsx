// src/admin/pages/PendingOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PendingOrders(){
  const [orders, setOrders] = useState([]);
useEffect(()=> {
    (async ()=>{
        try {
            const { data } = await api.get("/api/admin/orders?status=pending");
            setOrders(data.orders || data);
        } catch(err){ console.error(err); }
    })();
}, []);

const markShipped = async (id) => {
    try {
        await api.put(`/api/admin/orders/${id}/status`, { status: "shipped" });
        setOrders(prev => prev.filter(o => o._id !== id));
    } catch { alert("Failed"); }
};

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>
      <div className="grid grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o._id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold mb-2">{o.serialNo ?? o._id.slice(-6)}</div>
            <div className="mb-2">Name: {o.shippingAddress?.name}</div>
            <div className="mb-2">Amount: ₹{o.totalAmount}</div>
            <div className="mb-3">Items: {o.products?.length}</div>
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" onChange={()=>markShipped(o._id)} className="mr-2"/>
                Mark shipped
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
