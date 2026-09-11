import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

function LoginPage(){
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Read from the DOM/FormData so browser-saved autofill is captured
    // (controlled React state often misses password-manager fills).
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    const res = await login(email, password);
    if(res.success){
      navigate("/");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <>
      <SEO 
        title="Login | TOPSHOT"
        description="Sign in to your TOPSHOT account"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded shadow bg-white" autoComplete="on">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <label className="block mb-2 text-sm" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue=""
          className="w-full border p-2 rounded mb-4"
        />
        <label className="block mb-2 text-sm" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue=""
          className="w-full border p-2 rounded mb-4"
        />
        <button disabled={isLoading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 hover:bg-[#95C5F4]">
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm mt-3 text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
    </>
  );
}

export default LoginPage;
