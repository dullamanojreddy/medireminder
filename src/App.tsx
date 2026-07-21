import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { PatientProvider } from "./context/PatientContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// Authenticated Caregiver Pages
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import EditPatient from "./pages/EditPatient";
import PatientDetails from "./pages/PatientDetails";
import ReminderQueue from "./pages/ReminderQueue";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <ToastProvider>
      <PatientProvider>
        <Router>
          <Routes>
            {/* Public Landing, Login, Register Pages wrapped in MainLayout */}
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <LandingPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/login" 
              element={
                <MainLayout>
                  <LoginPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/register" 
              element={
                <MainLayout>
                  <RegisterPage />
                </MainLayout>
              } 
            />

            {/* Caregiver Portal (Authenticated Pages with ProtectedRoute + AppLayout) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients/add" 
              element={
                <ProtectedRoute>
                  <AddPatient />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditPatient />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reminders" 
              element={
                <ProtectedRoute>
                  <ReminderQueue />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            {/* Fallback to NotFound (Public Layout) */}
            <Route 
              path="*" 
              element={
                <MainLayout>
                  <NotFoundPage />
                </MainLayout>
              } 
            />
          </Routes>
        </Router>
      </PatientProvider>
    </ToastProvider>
  );
}
