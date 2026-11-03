import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Public Pages
import HomePage from "./pages/HomePage";
import TourDetailsPage from "./pages/TourDetailsPage";
import ContactPage from "./pages/ContactPage";
import ThemedTourPage from "./pages/themed-tour";
import GroupTourPage from "./pages/group-tour";
import CategoriesPage from "./pages/CategoriesPage";
import SubmitReviewPage from "./pages/SubmitReviewPage";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import ResetPassword from "./pages/admin/ResetPassword";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTours from "./pages/admin/ManageTours";
import ManageContent from "./pages/admin/ManageContent";
import ManageEnquiries from "./pages/admin/ManageEnquiries";
import ManageReviews from "./pages/admin/ManageReviews";
import ManageFaqs from "./pages/admin/ManageFaqs";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes (No traveler login required) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tour/:id" element={<TourDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
