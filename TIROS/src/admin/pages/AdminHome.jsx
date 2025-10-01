// src/admin/pages/AdminHome.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminHome(){
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try {
        const { data } = await api.get("/api/admin/dashboard/summary");
        setSummary(data);
      } catch(err){
        setError(err?.response?.data?.message || err.message);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold">₹{summary?.totalSales ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{summary?.orderCount ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{summary?.userCount ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
