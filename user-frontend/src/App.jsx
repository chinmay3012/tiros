import React from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ContactPage from "./pages/Contact.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import RefundCancellationPolicy from "./pages/RefundCancellationPolicy.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import { useAuth } from "./context/AuthContext";

// Placeholder pages for auth
const LoginPage = React.lazy(()=> import('./pages/LoginPage'));
const RegisterPage = React.lazy(()=> import('./pages/RegisterPage'));
const OrdersPage = React.lazy(()=> import('./pages/OrdersPage'));
const CategoryPage = React.lazy(()=> import('./pages/CategoryPage'));
const SubcategoryPage = React.lazy(()=> import('./pages/SubcategoryPage'));
const AccountPage = React.lazy(()=> import('./pages/AccountPage'));
const WishlistPage = React.lazy(()=> import('./pages/WishlistPage'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

        <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/categories/:categoryId/:subcategorySlug" element={<SubcategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-cancellation-policy" element={<RefundCancellationPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        </React.Suspense>

        <Footer />
      </div>
  );
}

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
}

export default App;
