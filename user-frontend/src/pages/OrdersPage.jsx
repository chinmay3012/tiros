import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get(`/orders/user/${user?._id}`);
        if (isMounted) { setOrders(res.data || []); }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [user?._id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 text-gray-900 tracking-tight text-center md:text-left">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-500">No orders found yet. Time to gear up!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 pb-6 mb-6">
                <div className="w-full">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Secure Order ID</p>
                  <h2 className="font-mono text-sm md:text-lg font-bold text-gray-800 break-all leading-relaxed">
                    #{o._id}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-sm ${o.status === 'delivered' ? 'bg-green-500 text-white' :
                      o.status === 'shipped' ? 'bg-blue-500 text-white' :
                        o.status === 'confirmed' ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'
                      }`}>
                      {o.status || 'Processing'}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex justify-between md:flex-col md:items-end bg-gray-100 md:bg-transparent p-5 md:p-0 rounded-[1.5rem] md:rounded-none">
                  <p className="text-[10px] font-black text-gray-400 md:text-gray-400 uppercase tracking-[0.2em] mb-1">Total Value</p>
                  <p className="text-2xl md:text-4xl font-black text-gray-900 md:text-gray-900">
                    <span className="text-xs md:text-lg font-medium mr-1 text-gray-400 md:text-gray-500">Rs.</span>
                    {o.finalAmount || o.totalAmount}
                  </p>
                  {o.coupon?.code && (
                    <p className="text-[10px] font-bold text-blue-600 mt-1">
                      Coupon Applied: {o.coupon.code}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Order Roster</p>
                <div className="grid gap-3">
                  {((o.items && o.items.length ? o.items : o.products) || []).map((it) => (
                    <div key={it._id} className="flex justify-between items-center py-4 px-5 bg-gray-50/50 rounded-2xl group border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors" />
                        <p className="text-gray-900 font-bold text-sm md:text-base">
                          {it.product?.name || it.product || it.productId?.name || it.productId}
                        </p>
                      </div>
                      <span className="flex items-center justify-center h-8 w-12 bg-white rounded-xl shadow-sm text-gray-900 text-xs font-black border border-gray-100">
                        x{it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* UI polish applied */}
    </div>
  );
}

export default OrdersPage;


