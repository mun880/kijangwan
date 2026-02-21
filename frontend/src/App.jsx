import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

import AdminDashboard from './features/admin/AdminDashboard';
import ManageRoutes from './features/admin/ManageRoutes';
import ManageDrivers from './features/admin/ManageDrivers';
import DriverDashboard from './features/driver/DriverDashboard';
import ManageVehicles from './features/driver/ManageVehicles';
import ManageSchedules from './features/driver/ManageSchedules';
import PassengerSearch from './features/passenger/PassengerSearch';
import ManageLogs from './features/admin/ManageLogs';
import AdminManageVehicles from './features/admin/AdminManageVehicles';
import Settings from './features/shared/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/driver/*"
            element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<DriverDashboard />} />
                    <Route path="vehicle" element={<ManageVehicles />} />
                    <Route path="schedule" element={<ManageSchedules />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/passenger/*"
            element={
              <ProtectedRoute allowedRoles={['PASSENGER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<PassengerSearch />} />
                    <Route path="bookings" element={<div className="text-2xl">My Bookings</div>} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="drivers" element={<ManageDrivers />} />
                    <Route path="routes" element={<ManageRoutes />} />
                    <Route path="vehicles" element={<AdminManageVehicles />} />
                    <Route path="logs" element={<ManageLogs />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
