import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SuccessNotification from "../components/SuccessNotification";

function RegisterPage(){
  const { register, login, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register({ name, email, password });
    if(res.success){
      setShowNotification(true);
      // Automatically log in the user after registration
      const loginRes = await login(email, password);
      if(loginRes.success){
        // Navigate to home page after showing notification
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // If auto-login fails, navigate to login page
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <>
      <SuccessNotification 
        message="Registered" 
        show={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded shadow bg-white">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <label className="block mb-2 text-sm">Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" required className="w-full border p-2 rounded mb-4" />
        <label className="block mb-2 text-sm">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full border p-2 rounded mb-4" />
        <label className="block mb-2 text-sm">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full border p-2 rounded mb-4" />
        <button disabled={isLoading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          {isLoading ? 'Submitting...' : 'Register'}
        </button>
        <p className="text-sm mt-3 text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
        {/* TODO: UI polish */}
      </form>
    </div>
    </>
  );
}

export default RegisterPage;



