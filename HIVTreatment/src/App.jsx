import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { EnhancedPageLoader } from './components/LoadingComponents';
import { ProtectedRoute, AdminRoute, UserRoute, StaffRoute } from './routes/ProtectedRoute';

// Public pages (no authentication required)
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Guides = React.lazy(() => import('./pages/Guides'));
const HealthAndLife = React.lazy(() => import('./pages/HealthAndLife'));
const AskAndAnswer = React.lazy(() => import('./pages/AskAndAnswer'));
const EducationalMaterials = React.lazy(() => import('./pages/EducationalMaterials'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));

// Auth pages
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

// Protected pages (require login)
const ConsultationBooking = React.lazy(() => import('./pages/ConsultationBooking'));
const UserProfile = React.lazy(() => import('./pages/user/UserProfile'));

// Admin only pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
// const SystemSettings = React.lazy(() => import('./pages/admin/SystemSettings'));

// // Staff only pages
// const StaffDashboard = React.lazy(() => import('./pages/staff/StaffDashboard'));
// const PatientManagement = React.lazy(() => import('./pages/staff/PatientManagement'));

function App() {
  return (
    <Router>
      <Suspense fallback={<EnhancedPageLoader />}>
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="guides" element={<Guides />} />
            <Route path="health-and-life" element={<HealthAndLife />} />
            <Route path="faq" element={<AskAndAnswer />} />
            <Route path="educational-materials" element={<EducationalMaterials />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            
            {/* Protected routes (require login) */}
            <Route 
              path="consultation-booking" 
              element={
                <ProtectedRoute>
                  <ConsultationBooking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <UserRoute>
                  <UserProfile />
                </UserRoute>
              } 
            />
          </Route>
          
          {/* Auth routes without layout */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Admin routes */}
          <Route 
            path="admin/dashboard" 
            element={
              // <AdminRoute>
                <AdminDashboard />
              // {/* </AdminRoute> */}
            } 
          />
          <Route 
            path="admin/users" 
            element={
              // <AdminRoute>
                <UserManagement />
              // </AdminRoute>
            } 
          />
          
          {/* Staff routes
          <Route 
            path="staff/dashboard" 
            element={
              <StaffRoute>
                <StaffDashboard />
              </StaffRoute>
            } 
          />
          <Route 
            path="staff/patients" 
            element={
              <StaffRoute>
                <PatientManagement />
              </StaffRoute>
            } 
          /> */}

          {/* Fallback route */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;