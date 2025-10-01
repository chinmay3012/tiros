import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function OrdersPage(){
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{
    let isMounted = true;
    (async ()=>{
      try{
        const res = await api.get(`/orders/user/${user?._id}`);
        if(isMounted){ setOrders(res.data || []); }
      }catch(err){
        setError("Failed to load orders");
      }finally{
        if(isMounted) setLoading(false);
      }
    })();
    return ()=>{ isMounted = false };
  },[user?._id]);

  if(loading) return <div className="p-8 text-center">Loading...</div>;
  if(error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o)=> (
            <div key={o._id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                <div className="font-semibold">Order #{o._id}</div>
                <div>Total: Rs. {o.totalAmount}</div>
              </div>
              <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
                {((o.items && o.items.length ? o.items : o.products) || []).map((it)=> (
                  <li key={it._id}>{(it.product?.name || it.product || it.productId?.name || it.productId)} x {it.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* TODO: UI polish */}
    </div>
  );
}

export default OrdersPage;


