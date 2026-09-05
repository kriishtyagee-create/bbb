import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentSkills } from './pages/student/StudentSkills';
import { SkillGapAnalysis } from './pages/student/SkillGapAnalysis';
import { StudentOpportunities } from './pages/student/StudentOpportunities';
import { ApplicationTracker } from './pages/student/ApplicationTracker';
import { StudentResume } from './pages/student/StudentResume';
import { StudentNotifications } from './pages/student/StudentNotifications';

// Industry Pages
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { PostOpportunity } from './pages/industry/PostOpportunity';
import { CandidateSearch } from './pages/industry/CandidateSearch';
import { ApplicationManagement } from './pages/industry/ApplicationManagement';
import { IndustryCollaborations } from './pages/industry/IndustryCollaborations';

// Academician Pages
import { AcademicianDashboard } from './pages/academician/AcademicianDashboard';
import { AcademicianStudents } from './pages/academician/AcademicianStudents';
import { SkillAnalytics } from './pages/academician/SkillAnalytics';
import { IndustryDemand } from './pages/academician/IndustryDemand';
import { CurriculumInsights } from './pages/academician/CurriculumInsights';
import { AcademicCollaborations } from './pages/academician/AcademicCollaborations';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminOpportunities } from './pages/admin/AdminOpportunities';

// Protected Route Wrapper
const ProtectedDashboard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Hub Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/skills"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentSkills />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/skill-gap"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <SkillGapAnalysis />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/internships"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentOpportunities />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentOpportunities />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <ApplicationTracker />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/resume"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentResume />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedDashboard allowedRoles={['student']}>
                <StudentNotifications />
              </ProtectedDashboard>
            }
          />

          {/* Industry Hub Routes */}
          <Route
            path="/industry/dashboard"
            element={
              <ProtectedDashboard allowedRoles={['industry']}>
                <IndustryDashboard />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/industry/post-opportunity"
            element={
              <ProtectedDashboard allowedRoles={['industry']}>
                <PostOpportunity />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/industry/candidates"
            element={
              <ProtectedDashboard allowedRoles={['industry']}>
                <CandidateSearch />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/industry/applications"
            element={
              <ProtectedDashboard allowedRoles={['industry']}>
                <ApplicationManagement />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/industry/collaborations"
            element={
              <ProtectedDashboard allowedRoles={['industry']}>
                <IndustryCollaborations />
              </ProtectedDashboard>
            }
          />

          {/* Academician Hub Routes */}
          <Route
            path="/academician/dashboard"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <AcademicianDashboard />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/academician/students"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <AcademicianStudents />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/academician/skill-analytics"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <SkillAnalytics />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/academician/industry-demand"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <IndustryDemand />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/academician/curriculum-insights"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <CurriculumInsights />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/academician/collaborations"
            element={
              <ProtectedDashboard allowedRoles={['academician']}>
                <AcademicCollaborations />
              </ProtectedDashboard>
            }
          />

          {/* Admin Hub Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedDashboard allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedDashboard allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedDashboard allowedRoles={['admin']}>
                <AdminSkills />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/admin/opportunities"
            element={
              <ProtectedDashboard allowedRoles={['admin']}>
                <AdminOpportunities />
              </ProtectedDashboard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
