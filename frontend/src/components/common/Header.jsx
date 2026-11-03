import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { FaWhatsapp } from "react-icons/fa";
import useContact from "../../hooks/useContact";

export default function Header() {
  const [themedOpen, setThemedOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const contact = useContact();

  const handleAboutClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const footerEl = document.getElementById("footer") || document.getElementById("about-us");
    if (footerEl) {
      footerEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#footer";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#078bd3] text-white shadow-md">
      <div className="mx-auto flex min-h-[90px] md:min-h-[110px] max-w-[1440px] items-center justify-between px-6 py-2 md:px-10">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Leela Tours"
            className="h-[75px] md:h-[90px] w-auto rounded-[12px] bg-white object-contain px-3 py-1.5 shadow"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="text-3xl md:hidden focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            mobileOpen ? "flex" : "hidden"
          } absolute left-0 top-full z-50 w-full flex-col gap-4 bg-[#078bd3] px-6 py-6 shadow-xl md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="font-montserrat text-[17px] font-semibold tracking-wide hover:text-blue-100 transition"
          >
            HOME
          </Link>

          {/* Themed Tours Dropdown */}
          <div
            className="relative group py-2"
            onMouseEnter={() => setThemedOpen(true)}
            onMouseLeave={() => setThemedOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setThemedOpen(!themedOpen);
                setGroupOpen(false);
              }}
              className="flex items-center gap-1 font-montserrat text-[17px] font-semibold tracking-wide hover:text-blue-100 transition cursor-pointer"
            >
              THEMED TOURS
              <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
            </button>

            {/* Dropdown Container (seamless bridge so hover never breaks) */}
            <div
              className={`pt-2 md:absolute md:left-0 md:top-full z-50 min-w-[220px] ${
                themedOpen ? "block" : "hidden md:group-hover:block"
              }`}
            >
              <div
                className="rounded-xl bg-white py-2 text-gray-800 shadow-xl border border-gray-100 animate-fadeIn"
                onClick={() => {
                  setThemedOpen(false);
                  setMobileOpen(false);
                }}
              >
                <Link
                  to="/categories/themed"
                  className="block px-4 py-2 font-montserrat text-sm font-semibold hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  All Themed Tours
                </Link>
                <Link
                  to="/categories/themed/sacred-journeys"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  Sacred Journeys
                </Link>
                <Link
                  to="/categories/themed/romantic-escapes"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  Romantic Escapes
                </Link>
                <Link
                  to="/categories/themed/heritage-and-culture"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  Heritage & Culture
                </Link>
              </div>
            </div>
          </div>

          {/* Group Tour Dropdown */}
          <div
            className="relative group py-2"
            onMouseEnter={() => setGroupOpen(true)}
            onMouseLeave={() => setGroupOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setGroupOpen(!groupOpen);
                setThemedOpen(false);
              }}
              className="flex items-center gap-1 font-montserrat text-[17px] font-semibold tracking-wide hover:text-blue-100 transition cursor-pointer"
            >
              GROUP TOUR
              <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
            </button>

            {/* Dropdown Container (seamless bridge so hover never breaks) */}
            <div
              className={`pt-2 md:absolute md:left-0 md:top-full z-50 min-w-[220px] ${
                groupOpen ? "block" : "hidden md:group-hover:block"
              }`}
            >
              <div
                className="rounded-xl bg-white py-2 text-gray-800 shadow-xl border border-gray-100 animate-fadeIn"
                onClick={() => {
                  setGroupOpen(false);
                  setMobileOpen(false);
                }}
              >
                <Link
                  to="/categories/group"
                  className="block px-4 py-2 font-montserrat text-sm font-semibold hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  All Group Tours
                </Link>
                <Link
                  to="/categories/group/friends-and-family-trips"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  Friends & Family Trips
                </Link>
                <Link
                  to="/categories/group/school-group-tours"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  School Group Tours
                </Link>
                <Link
                  to="/categories/group/senior-group-tours"
                  className="block px-4 py-2 font-montserrat text-sm hover:bg-blue-50 hover:text-[#07569b] transition"
                >
                  Senior Group Tours
                </Link>
              </div>
            </div>
          </div>

          {/* About Us (Smooth Scroll to Footer) */}
          <a
            href="#footer"
            onClick={handleAboutClick}
            className="font-montserrat text-[17px] font-semibold tracking-wide hover:text-blue-100 transition cursor-pointer"
          >
            ABOUT US
          </a>

          {/* WhatsApp Direct Contact Button */}
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
              "Hello Leela Tours! I have an inquiry."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 rounded-full border-2 border-white bg-[#08a900] px-4 py-2 text-[15px] font-semibold tracking-wide transition hover:bg-green-700 shadow"
          >
            <FaWhatsapp className="text-xl" />
            <span>BOOK ON WHATSAPP</span>
          </a>

          {/* Admin Link */}
          {/* <Link
            to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
            onClick={() => setMobileOpen(false)}
            title="Admin Management"
            className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition"
          >
            <FaShieldAlt className="text-sm" />
            <span>{isAuthenticated ? "Dashboard" : "Admin"}</span>
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
