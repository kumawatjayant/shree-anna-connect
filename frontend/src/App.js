import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/farmer/Dashboard';
import ProcessorDashboard from './pages/processor/Dashboard';
import ConsumerDashboard from './pages/consumer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import CropDetail from './pages/CropDetail';
import TraceabilityView from './pages/TraceabilityView';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green for agriculture
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#ff6f00', // Orange for energy
      light: '#ffa040',
      dark: '#c43e00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Protected Route for Regular Users
const UserProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Protected Route for Admin
const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const { admin } = useAdminAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/crop/:id" element={<CropDetail />} />
      <Route path="/trace/:batchId" element={<TraceabilityView />} />

      {/* Protected Routes - Farmer/FPO/SHG */}
      <Route
        path="/farmer/*"
        element={
          <UserProtectedRoute allowedRoles={['farmer', 'fpo', 'shg']}>
            <FarmerDashboard />
          </UserProtectedRoute>
        }
      />

      {/* Protected Routes - Processor */}
      <Route
        path="/processor/*"
        element={
          <UserProtectedRoute allowedRoles={['processor']}>
            <ProcessorDashboard />
          </UserProtectedRoute>
        }
      />

      {/* Protected Routes - Consumer */}
      <Route
        path="/consumer/*"
        element={
          <UserProtectedRoute allowedRoles={['consumer']}>
            <ConsumerDashboard />
          </UserProtectedRoute>
        }
      />

      {/* Admin Login - Separate from regular login */}
      <Route path="/admin/login" element={admin ? <Navigate to="/admin" /> : <AdminLogin />} />

      {/* Protected Routes - Admin */}
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
