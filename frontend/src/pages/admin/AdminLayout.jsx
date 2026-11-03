import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import logo from "../../assets/Logo.png";
import {
  FaTachometerAlt,
  FaSuitcase,
  FaEdit,
  FaEnvelopeOpenText,
  FaStar,
  FaQuestionCircle,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { label: "Manage Tours", path: "/admin/tours", icon: <FaSuitcase /> },
    { label: "Site Content", path: "/admin/content", icon: <FaEdit /> },
    { label: "Enquiries & Leads", path: "/admin/enquiries", icon: <FaEnvelopeOpenText /> },
    { label: "Reviews", path: "/admin/reviews", icon: <FaStar /> },
    { label: "FAQs", path: "/admin/faqs", icon: <FaQuestionCircle /> },
    { label: "ID & Password", path: "/admin/profile", icon: <FaUserShield /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-montserrat">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#07569b] text-white transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-blue-800/80 px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Leela Tours"
              className="h-10 w-auto rounded bg-white p-1"
            />
            <span className="font-caladea text-xl font-bold tracking-wide">
              Admin Panel
            </span>
          </Link>
          <button
            type="button"
            className="md:hidden text-white text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#ff6500] text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="border-t border-blue-800/80 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-600/80 hover:bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-gray-600 text-xl md:hidden focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h2 className="font-caladea text-xl font-bold text-gray-800 hidden sm:block">
              Leela Tours CMS
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <FaExternalLinkAlt className="text-[10px]" />
              <span>View Site</span>
            </Link>

            <Link
              to="/admin/profile"
              title="Manage Admin ID & Password"
              className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#07569b] text-xs font-bold text-white uppercase shadow-xs">
                {admin?.name?.charAt(0) || "A"}
              </div>
              <span className="text-xs font-semibold text-gray-800 hidden md:block">
                {admin?.name || "Admin"}
              </span>
            </Link>
          </div>
        </header>

        {/* Routed Sub-pages */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
