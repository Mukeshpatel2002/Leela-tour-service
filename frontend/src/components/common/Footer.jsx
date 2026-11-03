import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContent } from "../../api/api";
import useContact from "../../hooks/useContact";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  const contact = useContact();
  const [footerData, setFooterData] = useState({
    phone: "+91 98765 43210",
    email: "leelatours@gmail.com",
    address: "Pune, Maharashtra",
    aboutText: "For over 10 years we have taken families, couples, students and seniors across India. Small groups, handpicked stays, transparent pricing and zero hidden costs.",
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await getContent();
        if (res.data?.success && res.data.content?.footer) {
          setFooterData((prev) => ({
            ...prev,
            ...res.data.content.footer,
          }));
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchFooter();
  }, []);

  const linkStyle =
    "block text-[15px] leading-[26px] text-white/90 transition hover:text-orange-300";
  const headingStyle =
    "mb-3 text-[19px] font-bold text-white font-caladea tracking-wide";

  const handleScrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const handlePageClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="w-full bg-[#09579a] text-white scroll-mt-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-10">
        {/* Section 1: Quick Links */}
        <div>
          <h3 className={headingStyle}>Quick Links</h3>
          <ul className="space-y-1 font-montserrat">
            <li>
              <Link to="/" onClick={handlePageClick} className={linkStyle}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handlePageClick} className={linkStyle}>
                Contact Us
              </Link>
            </li>
            <li>
              <a
                href="#trips-section"
                onClick={handleScrollToSection("trips-section")}
                className={linkStyle}
              >
                Featured Tours
              </a>
            </li>
            <li>
              <a
                href="#why-section"
                onClick={handleScrollToSection("why-section")}
                className={linkStyle}
              >
                Why Leela Tours
              </a>
            </li>
            <li>
              <a
                href="#faq-section"
                onClick={handleScrollToSection("faq-section")}
                className={linkStyle}
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Section 2: Tour Categories */}
        <div>
          <h3 className={headingStyle}>Tour Categories</h3>
          <ul className="space-y-1 font-montserrat">
            <li>
              <Link
                to="/categories/group/school-group-tours"
                onClick={handlePageClick}
                className={linkStyle}
              >
                School Trips
              </Link>
            </li>
            <li>
              <Link
                to="/categories/themed/sacred-journeys"
                onClick={handlePageClick}
                className={linkStyle}
              >
                Religious & Sacred Tours
              </Link>
            </li>
            <li>
              <Link
                to="/categories/group/senior-group-tours"
                onClick={handlePageClick}
                className={linkStyle}
              >
                Senior Group Tours
              </Link>
            </li>
            <li>
              <Link
                to="/categories/group/friends-and-family-trips"
                onClick={handlePageClick}
                className={linkStyle}
              >
                Student & Adventure Tours
              </Link>
            </li>
            <li>
              <Link
                to="/categories/themed/romantic-escapes"
                onClick={handlePageClick}
                className={linkStyle}
              >
                Honeymoon Packages
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact Us */}
        <div>
          <h3 className={headingStyle}>Contact Us</h3>
          <div className="space-y-3 font-montserrat text-[14px]">
            <p className="flex items-center gap-2">
              <FaPhone className="text-orange-400 shrink-0" />
              <a href={`tel:${footerData.phone}`} className="hover:text-orange-300">
                {footerData.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-orange-400 shrink-0" />
              <a href={`mailto:${footerData.email}`} className="hover:text-orange-300">
                {footerData.email}
              </a>
            </p>
            <p className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-orange-400 shrink-0 mt-1" />
              <span>{footerData.address}</span>
            </p>
          </div>
        </div>

        {/* Section 4: About Leela Tours */}
        <div id="about-us" className="scroll-mt-24">
          <h3 className={headingStyle}>About Leela Tours</h3>
          <p className="font-montserrat text-[13px] leading-relaxed text-blue-100 mb-4">
            {footerData.aboutText}
          </p>

          <p className="mb-2 font-montserrat text-sm font-semibold text-white">Follow Us</p>
          <div className="flex items-center gap-3">
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Leela Tours on Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-[#1877f2] hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Leela Tours on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-gradient-to-br hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af]"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-800/80 py-4 text-center font-montserrat text-xs text-blue-200">
        © {new Date().getFullYear()} Leela Tours & Travels. All Rights Reserved.
      </div>
    </footer>
  );
}
