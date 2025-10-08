import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Admin Context Provider
import { AuthProvider as AdminAuthProvider, useAuth } from './admin/AuthProvider';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/pages/Dashboard';
import AllOrders from './admin/pages/AllOrders';
import PendingOrders from './admin/pages/PendingOrders';
import Categories from './admin/pages/Categories';
import Products from './admin/pages/Products';
import Users from './admin/pages/Users';
import Inventory from './admin/pages/Inventory';
import Reports from './admin/pages/Reports';
import Coupons from './admin/pages/Coupons';

// Admin Protected Route
import AdminProtectedRoute from './admin/ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';

// Admin redirect component for unknown routes
function AdminRedirect() {
  const { token, admin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (token && admin) {
        // Redirect unknown routes to admin dashboard
        navigate('/admin', { replace: true });
      } else {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [token, admin, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

// Not found component for non-admin routes
function NotFound() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect any unknown route to admin login
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Root redirect to admin login */}
              <Route path="/" element={<AdminLogin />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout><Dashboard /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminLayout><Dashboard /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminProtectedRoute>
                  <AdminLayout><AllOrders /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/pending-orders" element={
                <AdminProtectedRoute>
                  <AdminLayout><PendingOrders /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminProtectedRoute>
                  <AdminLayout><Categories /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <AdminProtectedRoute>
                  <AdminLayout><Products /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <AdminProtectedRoute>
                  <AdminLayout><Users /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/inventory" element={
                <AdminProtectedRoute>
                  <AdminLayout><Inventory /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminProtectedRoute>
                  <AdminLayout><Reports /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/coupons" element={
                <AdminProtectedRoute>
                  <AdminLayout><Coupons /></AdminLayout>
                </AdminProtectedRoute>
              } />
              
              {/* Catch-all route for unknown admin routes */}
              <Route path="/admin/*" element={<AdminRedirect />} />
              
              {/* Catch-all route for any other unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;