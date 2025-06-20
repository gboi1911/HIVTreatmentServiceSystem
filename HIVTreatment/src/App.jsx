import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Layout from './components/Layout';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Guides = React.lazy(() => import('./pages/Guides'));
const HealthAndLife = React.lazy(() => import('./pages/HealthAndLife'));
const AskAndAnswer = React.lazy(() => import('./pages/AskAndAnswer'));
const EducationalMaterials = React.lazy(() => import('./pages/EducationalMaterials'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const ConsultationBooking = React.lazy(() => import('./pages/ConsultationBooking'));

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="text-center">
      <Spin size="large" />
      <div className="mt-4 text-gray-600 font-medium">Đang tải...</div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="guides" element={<Guides />} />
            <Route path="health-and-life" element={<HealthAndLife />} />
            <Route path="faq" element={<AskAndAnswer />} />
            <Route path="educational-materials" element={<EducationalMaterials />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="consultation-booking" element={<ConsultationBooking />} />
          </Route>
          
          {/* Auth routes without layout */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Admin routes */}
          <Route path="dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;