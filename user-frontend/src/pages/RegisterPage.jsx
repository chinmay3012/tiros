import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage(){
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await register({ name, email, password });
    if(res.success){
      setSuccess("Registered! You can login now.");
      navigate("/login");
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
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
  );
}

export default RegisterPage;



