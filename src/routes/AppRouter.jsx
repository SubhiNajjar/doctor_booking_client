import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/MainLayout';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import SettingsPage from '../pages/SettingsPage';

import ClientDashboardPage from '../pages/client/ClientDashboardPage';
import ClientAppointmentsListPage from '../pages/client/ClientAppointmentsListPage';
import ClientCreateAppointmentPage from '../pages/client/ClientCreateAppointmentPage';

import DoctorDashboardPage from '../pages/doctor/DoctorDashboardPage';
import DoctorBookingsListPage from '../pages/doctor/DoctorBookingsListPage';
import DoctorCreateAppointmentPage from '../pages/doctor/DoctorCreateAppointmentPage';

function RootRedirect() {
  const { user, initialized } = useSelector((state) => state.auth);
  if (!initialized) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/client/dashboard" replace />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — shared layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/settings" element={<SettingsPage />} />

            {/* Patient routes */}
            <Route element={<ProtectedRoute requiredRole="patient" />}>
              <Route path="/client/dashboard" element={<ClientDashboardPage />} />
              <Route path="/client/appointments" element={<ClientAppointmentsListPage />} />
              <Route path="/client/book" element={<ClientCreateAppointmentPage />} />
            </Route>

            {/* Doctor routes */}
            <Route element={<ProtectedRoute requiredRole="doctor" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/appointments" element={<DoctorBookingsListPage />} />
              <Route path="/doctor/availability" element={<DoctorCreateAppointmentPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
