import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Context Provider
import { AuthProvider as AdminAuthProvider } from './admin/AuthProvider';

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

// Admin Protected Route
import AdminProtectedRoute from './admin/ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';

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
            </Routes>
          </div>
        </Router>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;