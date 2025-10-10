import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage(){
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if(res.success){
      navigate("/");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <label className="block mb-2 text-sm">Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full border p-2 rounded mb-4" />
        <label className="block mb-2 text-sm">Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full border p-2 rounded mb-4" />
        <button disabled={isLoading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 hover:bg-[#95C5F4]">
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm mt-3 text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
        {/* TODO: UI polish */}
      </form>
    </div>
  );
}

export default LoginPage;



