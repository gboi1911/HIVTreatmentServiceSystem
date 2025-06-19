import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutUs from "./pages/About";
import Guides from "./pages/Guides";
import BlogDetail from "./pages/BlogDetail";
import HealthAndLife from "./pages/HealthAndLife";
import AnnouncementsPage from "./pages/AskAndAnswer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/user/UserProfile";
import ConsultationBooking from "./pages/ConsultationBooking";
import EducationalMaterials from "./pages/EducationalMaterials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="health-and-life" element={<HealthAndLife />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/BlogDetail" element={<BlogDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/consultation-booking" element={<ConsultationBooking />} />
          <Route path="/material" element={<EducationalMaterials />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
