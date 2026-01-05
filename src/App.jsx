import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLES } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

import './index.css';

// Loading component for lazy loaded pages
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner"></div>
      <p>Loading...</p>
      <style>{`
        .page-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }
        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .page-loader p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const PatientsPage = lazy(() => import('./pages/admin/PatientsPage'));
const AppointmentsPage = lazy(() => import('./pages/admin/AppointmentsPage'));
const StaffPage = lazy(() => import('./pages/admin/StaffPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./pages/doctor/DoctorPatients'));
const DoctorSchedule = lazy(() => import('./pages/doctor/DoctorSchedule'));
const DoctorProfile = lazy(() => import('./pages/doctor/DoctorProfile'));

// Receptionist Pages
const ReceptionistDashboard = lazy(() => import('./pages/receptionist/ReceptionistDashboard'));
const PatientRegistration = lazy(() => import('./pages/receptionist/PatientRegistration'));
const ReceptionistAppointments = lazy(() => import('./pages/receptionist/ReceptionistAppointments'));
const ReceptionistPatients = lazy(() => import('./pages/receptionist/ReceptionistPatients'));
const ReceptionistCheckin = lazy(() => import('./pages/receptionist/ReceptionistCheckin'));

// Patient Pages
const PatientPortal = lazy(() => import('./pages/patient/PatientPortal'));
const AppointmentBooking = lazy(() => import('./pages/patient/AppointmentBooking'));
const PatientAppointments = lazy(() => import('./pages/patient/PatientAppointments'));
const PatientRecords = lazy(() => import('./pages/patient/PatientRecords'));
const PatientProfile = lazy(() => import('./pages/patient/PatientProfile'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <UserManagement />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/patients" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientsPage />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/appointments" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <AppointmentsPage />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/staff" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <StaffPage />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ReportsPage />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <SettingsPage />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <DoctorDashboard />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <DoctorAppointments />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/patients" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <DoctorPatients />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/schedule" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <DoctorSchedule />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctor/profile" element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <DoctorProfile />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Receptionist Routes */}
            <Route path="/receptionist" element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceptionistDashboard />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/receptionist/register" element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientRegistration />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/receptionist/appointments" element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceptionistAppointments />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/receptionist/patients" element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceptionistPatients />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/receptionist/checkin" element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <ReceptionistCheckin />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientPortal />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/patient/appointments" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientAppointments />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/patient/book" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <AppointmentBooking />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/patient/records" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientRecords />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/patient/profile" element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <PatientProfile />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
