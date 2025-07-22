import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { EnhancedPageLoader } from "./components/LoadingComponents";
import {
  ProtectedRoute,
  AdminRoute,
  UserRoute,
  StaffRoute,
} from "./routes/ProtectedRoute";

// Public pages (no authentication required)
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Guides = React.lazy(() => import("./pages/Guides"));
const HealthAndLife = React.lazy(() => import("./pages/HealthAndLife"));
const AskAndAnswer = React.lazy(() => import("./pages/AskAndAnswer"));
const EducationalMaterials = React.lazy(() =>
  import("./pages/EducationalMaterials")
);
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const EducationPage = React.lazy(() => import("./pages/EducationContent"));
const EducationDetail = React.lazy(() => import("./pages/EducationDetail"));
const EducationStaff = React.lazy(() => import("./pages/EducationStaff"));
const BlogStaff = React.lazy(() => import("./pages/BlogStaff"));

// Auth pages
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));

// Protected pages (require login)
const ConsultationBooking = React.lazy(() =>
  import("./pages/ConsultationBooking")
);
const AppointmentHistory = React.lazy(() =>
  import("./pages/AppointmentHistory")
);
const BookingSuccess = React.lazy(() =>
  import("./pages/BookingSuccess")
);
const UserProfile = React.lazy(() => import("./pages/user/UserProfile"));

// Assessment pages
const RiskAssessment = React.lazy(() =>
  import("./pages/assessment/RiskAssessment")
);
const AssessmentResults = React.lazy(() =>
  import("./pages/assessment/AssessmentResults")
);
const AssessmentHistory = React.lazy(() =>
  import("./pages/assessment/AssessmentHistory")
);

// Medical Record pages
const MedicalRecords = React.lazy(() =>
  import("./pages/medical/MedicalRecords")
);
const MedicalRecordForm = React.lazy(() =>
  import("./pages/medical/MedicalRecordForm")
);
const MedicalRecordDetail = React.lazy(() =>
  import("./pages/medical/MedicalRecordDetail")
);

// Treatment Plan pages
const TreatmentPlans = React.lazy(() =>
  import("./pages/treatment/TreatmentPlans")
);
const TreatmentPlanForm = React.lazy(() =>
  import("./pages/treatment/TreatmentPlanForm")
);
const TreatmentPlanDetail = React.lazy(() =>
  import("./pages/treatment/TreatmentPlanDetail")
);

// Admin only pages
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement").then(module => ({ default: module.UserManagement })));
const StaffManagement = React.lazy(() => import("./pages/admin/StaffManagement").then(module => ({ default: module.StaffManagement })));
// const SystemSettings = React.lazy(() => import('./pages/admin/SystemSettings'));

// // Staff only pages
// const StaffDashboard = React.lazy(() => import('./pages/staff/StaffDashboard'));
// const PatientManagement = React.lazy(() => import('./pages/staff/PatientManagement'));

// Doctor pages
const DoctorDashboard = React.lazy(() => import("./pages/doctor/Dashboard"));
const DoctorAppointments = React.lazy(() => import("./pages/doctor/Appointments"));
const DoctorPatients = React.lazy(() => import("./pages/doctor/Patients"));
const DoctorLabResults = React.lazy(() => import("./pages/doctor/LabResults"));
const DoctorTreatmentPlans = React.lazy(() => import("./pages/doctor/TreatmentPlans"));
const DoctorProfile = React.lazy(() => import("./pages/doctor/DoctorProfile"));

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
            <Route
              path="educational-materials"
              element={<EducationalMaterials />}
            />
            <Route path="education" element={<EducationPage />} />
            <Route path="education/staff" element={<EducationStaff />} />
            <Route path="education/:postId" element={<EducationDetail />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="blog/staff" element={<BlogStaff />} />

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
              path="booking-success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />

            {/* Assessment routes */}
            <Route
              path="assessment/risk-assessment"
              element={
                <ProtectedRoute>
                  <RiskAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="assessment/results/:assessmentId"
              element={
                <ProtectedRoute>
                  <AssessmentResults />
                </ProtectedRoute>
              }
            />

            {/* User routes */}
            <Route
              path="user/assessment-history"
              element={
                <UserRoute>
                  <AssessmentHistory />
                </UserRoute>
              }
            />
            <Route
              path="user/appointment-history"
              element={
                <UserRoute>
                  <AppointmentHistory />
                </UserRoute>
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
            <Route
              path="user/profile"
              element={
                <UserRoute>
                  <UserProfile />
                </UserRoute>
              }
            />

            {/* Medical Records routes */}
            <Route
              path="medical-records"
              element={
                // <ProtectedRoute>
                  <MedicalRecords />
                // </ProtectedRoute>
              }
            />
            <Route
              path="medical-records/new"
              element={
                // <ProtectedRoute>
                  <MedicalRecordForm />
                // </ProtectedRoute>
              }
            />
            <Route
              path="medical-records/edit/:id"
              element={
                // <ProtectedRoute>
                  <MedicalRecordForm />
                // </ProtectedRoute>
              }
            />
            <Route
              path="medical-records/:id"
              element={
                // <ProtectedRoute>
                  <MedicalRecordDetail />
                // </ProtectedRoute>
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
              <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
              <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="admin/staff"
            element={
              <AdminRoute>
              <StaffManagement />
              </AdminRoute>
            }
          />

          {/* Doctor routes */}
          <Route
            path="doctor/dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/appointments"
            element={
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/patients"
            element={
              <ProtectedRoute>
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/lab-results"
            element={
              <ProtectedRoute>
                <DoctorLabResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/treatment-plans"
            element={
              <ProtectedRoute>
                <DoctorTreatmentPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/profile"
            element={
              <ProtectedRoute>
                <DoctorProfile />
              </ProtectedRoute>
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
