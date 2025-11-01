import { useState } from "react";
import api from "../api/axios";
import SuccessNotification from "./SuccessNotification";

function SignUpForDrops() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/dropsignups", { email });
      
      if (response.data.success) {
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Drop signup error:", err);
      setError(
        err.response?.data?.message || "Failed to sign up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessNotification 
        message="Successfully signed up for drops!" 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
      <div className="bg-gray-100 py-16" style={{ backgroundColor: 'hsl(0, 0%, 98%)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: 'Kode Mono, monospace' }}
            >
              SIGN UP FOR DROPS
            </h2>
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Be the first to know about our new releases and exclusive drops.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex-1 w-full sm:max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold whitespace-nowrap"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {loading ? "SAVING..." : "SAVE"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-red-600 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpForDrops;

