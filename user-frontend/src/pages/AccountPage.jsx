import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function AccountPage(){
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(()=>{
    try{ const raw = window.localStorage.getItem('shippingAddress'); return raw? JSON.parse(raw) : {}; }catch{return {}} 
  });

  useEffect(()=>{
    if(tab==='orders' && user?._id){
      (async()=>{
        try{ const { data } = await api.get(`/orders/user/${user._id}`); setOrders(data||[]); }catch{}
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
        <div className="space-y-4">
          {orders.map(o=> (
            <div key={o._id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div className="font-semibold">#{o._id}</div>
                <div>Status: {o.status}</div>
              </div>
              <div className="text-sm">Payment: {o.payment?.status||'created'} {o.payment?.paymentId ? `(${o.payment.paymentId})` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='payments' && (
        <div className="text-sm text-gray-700">Payment receipts will appear here after checkout. {/* TODO: UI polish */}</div>
      )}
    </div>
  );
}

export default AccountPage;


