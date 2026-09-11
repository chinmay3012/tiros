import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SuccessNotification from "../components/SuccessNotification";

function RegisterPage(){
  const { register, login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }
    const res = await register({ name, email, password });
    if(res.success){
      setShowNotification(true);
      const loginRes = await login(email, password);
      if(loginRes.success){
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
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
        <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded shadow bg-white" autoComplete="on">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <label className="block mb-2 text-sm" htmlFor="register-name">Name</label>
        <input id="register-name" name="name" type="text" required autoComplete="name" className="w-full border p-2 rounded mb-4" />
        <label className="block mb-2 text-sm" htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" required autoComplete="email" className="w-full border p-2 rounded mb-4" />
        <label className="block mb-2 text-sm" htmlFor="register-password">Password</label>
        <input id="register-password" name="password" type="password" required autoComplete="new-password" minLength={6} className="w-full border p-2 rounded mb-4" />
        <button disabled={isLoading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 hover:bg-[#95C5F4]">
          {isLoading ? 'Submitting...' : 'Register'}
        </button>
        <p className="text-sm mt-3 text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
    </>
  );
}

export default RegisterPage;
