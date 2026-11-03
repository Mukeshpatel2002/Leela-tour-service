import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../api/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/hero.png";
import { toast } from "react-hot-toast";
import { FaLock, FaKey, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function ResetPassword() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = paramToken || searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { updateAdminSession } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, { password });

      if (res.data?.success) {
        toast.success(res.data.message || "Password reset successfully!");
        setSuccess(true);
        if (res.data.token && res.data.admin) {
          updateAdminSession(res.data.admin, res.data.token);
        }
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired reset token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#07569b] via-[#094170] to-[#001c34] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link to="/">
            <img
              src={logo}
              alt="Leela Tours"
              className="mx-auto h-20 w-auto rounded-xl border border-gray-100 object-contain p-2 shadow-sm"
            />
          </Link>
          <h1 className="mt-4 font-caladea text-3xl font-bold text-[#07569b]">
            Set New Password
          </h1>
          <p className="mt-1 font-montserrat text-xs text-gray-500">
            Create a secure password for your Leela Tours Admin account.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4 font-montserrat">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
              <FaCheckCircle />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Password Changed!</h3>
            <p className="text-xs text-gray-600">
              Your password has been reset successfully. Redirecting you to the admin dashboard...
            </p>
            <div className="pt-2">
              <Link
                to="/admin/dashboard"
                className="inline-block rounded-xl bg-[#07569b] px-6 py-2.5 text-xs font-bold text-white shadow"
              >
                Go to Dashboard Now
              </Link>
            </div>
          </div>
        ) : !token ? (
          <div className="text-center py-6 space-y-4 font-montserrat">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
              <p className="font-bold">Missing Reset Token</p>
              <p className="mt-1">
                The password reset link appears incomplete or has expired. Please request a new link from the login page.
              </p>
            </div>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#07569b] px-6 py-2.5 text-xs font-bold text-white shadow"
            >
              <FaArrowLeft />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-montserrat">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaKey />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-type new password"
                  className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#ff6500] hover:bg-orange-600 text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Reset Password & Login"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/admin/login"
                className="text-xs font-semibold text-gray-500 hover:text-[#07569b] transition"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
