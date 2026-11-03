import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { updateAdminProfile, changeAdminPassword, getAdminMe } from "../../api/api";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaCheckCircle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function AdminProfile() {
  const { admin, updateAdminSession } = useAdminAuth();

  // Profile / ID State
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
    }
  }, [admin]);

  // Handle changing Admin ID / Email / Name
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Admin Email/ID cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);
      const res = await updateAdminProfile({ name, email });

      if (res.data?.success) {
        toast.success(res.data.message || "Admin ID updated successfully!");
        updateAdminSession(res.data.admin, res.data.token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update admin profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle changing Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await changeAdminPassword({
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        toast.success("Password changed successfully!");
        if (res.data.token) {
          updateAdminSession(res.data.admin, res.data.token);
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <FaShieldAlt className="text-[#07569b]" />
            <span>Admin ID & Security Settings</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500 font-montserrat">
            Change your Admin login Email (ID), Admin Name, and update your login password.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: CHANGE ADMIN ID (EMAIL) & NAME */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs font-montserrat">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#07569b]">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Admin Account & ID</h2>
              <p className="text-xs text-gray-500">Your login identifier on the portal</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Admin Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Admin"
                  className="h-10 w-full rounded-xl border border-gray-300 pl-9 pr-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Admin ID / Login Email *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@leelatours.com"
                  className="h-10 w-full rounded-xl border border-gray-300 pl-9 pr-3 text-sm focus:border-blue-500 outline-none font-medium text-gray-800"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                You will use this email address to log in to the admin panel.
              </p>
            </div>

            <div className="rounded-xl bg-sky-50 border border-sky-100 p-3 text-sky-800 text-[11px] flex items-start gap-2">
              <FaCheckCircle className="text-sky-600 mt-0.5 shrink-0" />
              <span>
                Changing your ID will automatically update your active session with the new credentials.
              </span>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-2 w-full rounded-xl bg-[#07569b] hover:bg-blue-800 py-2.5 text-sm font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? "Updating ID..." : "Save Admin ID / Profile"}
            </button>
          </form>
        </div>

        {/* SECTION 2: CHANGE PASSWORD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs font-montserrat">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#ff6500]">
              <FaKey className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Update your current account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Current Password *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="h-10 w-full rounded-xl border border-gray-300 pl-9 pr-10 text-sm focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaKey />
                </span>
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="h-10 w-full rounded-xl border border-gray-300 pl-9 pr-10 text-sm focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaCheckCircle />
                </span>
                <input
                  type={showNewPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-type new password"
                  className="h-10 w-full rounded-xl border border-gray-300 pl-9 pr-3 text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="mt-2 w-full rounded-xl bg-[#ff6500] hover:bg-orange-600 py-2.5 text-sm font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
            >
              {savingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
