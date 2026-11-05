import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Public Pages
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import ThemedTourPage from "./pages/themed-tour";
import GroupTourPage from "./pages/group-tour";
import CategoriesPage from "./pages/CategoriesPage";

// Lazy: keeps the admin portal and the tour detail view out of the bundle that
// first-time visitors download.
const TourDetailsPage = lazy(() => import("./pages/TourDetailsPage"));
const SubmitReviewPage = lazy(() => import("./pages/SubmitReviewPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageTours = lazy(() => import("./pages/admin/ManageTours"));
const ManageContent = lazy(() => import("./pages/admin/ManageContent"));
const ManageEnquiries = lazy(() => import("./pages/admin/ManageEnquiries"));
const ManageReviews = lazy(() => import("./pages/admin/ManageReviews"));
const ManageFaqs = lazy(() => import("./pages/admin/ManageFaqs"));
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollJump from "./components/common/ScrollJump";

const RouteFallback = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#07569b] border-t-transparent" />
  </div>
);

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ScrollJump />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
          {/* Public Routes (No traveler login required) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tour/:id" element={<TourDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/themed-tour" element={<ThemedTourPage />} />
          <Route path="/group-tour" element={<GroupTourPage />} />
          <Route path="/categories/:type" element={<CategoriesPage />} />
          <Route path="/categories/:type/:categorySlug" element={<CategoriesPage />} />
          <Route path="/submit-review" element={<SubmitReviewPage />} />

          {/* Admin Authentication & Password Recovery */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Admin Management Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tours" element={<ManageTours />} />
            <Route path="content" element={<ManageContent />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="faqs" element={<ManageFaqs />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
