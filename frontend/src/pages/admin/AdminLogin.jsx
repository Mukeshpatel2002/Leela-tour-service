import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { forgotPassword } from "../../api/api";
import logo from "../../assets/Logo.png";
import { toast } from "react-hot-toast";
import { FaLock, FaEnvelope, FaKey, FaArrowLeft, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Mode
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [generatedResetUrl, setGeneratedResetUrl] = useState("");

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } else {
      toast.error(result.message || "Invalid email or password");
    }

    setLoading(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await forgotPassword({ email: forgotEmail });

      if (res.data?.success) {
        toast.success(res.data.message || "Reset link sent!");
        setResetSent(true);
        if (res.data.resetUrl) {
          setGeneratedResetUrl(res.data.resetUrl);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setForgotLoading(false);
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
            {isForgotMode ? "Forgot Password" : "Admin Control Panel"}
          </h1>
          <p className="mt-1 font-montserrat text-xs text-gray-500">
            {isForgotMode
              ? "Recover access to your Leela Tours Admin account."
              : "Secure access to manage tours, content, and inquiries."}
          </p>
        </div>

        {isForgotMode ? (
          /* FORGOT PASSWORD FORM */
          <div className="font-montserrat">
            {resetSent ? (
              <div className="space-y-4 py-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-base font-bold text-gray-900">Reset Link Sent!</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We have sent a secure password reset link to <strong className="text-gray-900">{forgotEmail}</strong>.
                  Please check your inbox (or spam folder) and follow the link to set a new password.
                </p>

                {generatedResetUrl && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-left">
                    <p className="text-[11px] font-bold text-[#07569b] uppercase tracking-wider mb-1">
                      Direct Link (Dev Mode):
                    </p>
                    <Link
                      to={generatedResetUrl.replace(/^https?:\/\/[^/]+/, "")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6500] hover:underline"
                    >
                      <span>Open Reset Password Page</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </Link>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setResetSent(false);
                      setGeneratedResetUrl("");
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#07569b] hover:underline cursor-pointer"
                  >
                    <FaArrowLeft />
                    <span>Return to Login</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Registered Admin Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="e.g. admin@leelatours.com"
                      className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    A password reset link will be sent to this email address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#ff6500] hover:bg-orange-600 text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {forgotLoading ? "Sending Link..." : "Send Reset Link to Email"}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#07569b] transition cursor-pointer"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-montserrat">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Email / ID
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@leelatours.com"
                  className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setIsForgotMode(true);
                  }}
                  className="text-xs font-semibold text-[#07569b] hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#ff6500] hover:bg-orange-600 text-sm font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <Link
            to="/"
            className="font-montserrat text-xs text-gray-500 hover:text-[#07569b] transition"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
