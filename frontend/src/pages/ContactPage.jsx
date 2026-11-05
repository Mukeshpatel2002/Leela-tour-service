import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getContent, submitEnquiry } from "../api/api";
import { toast } from "react-hot-toast";
import { FaPhoneAlt, FaEnvelope, FaBuilding, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    corporateOffice:
      "Office No. 204, 2nd Floor, ABC Business Plaza, FC Road, Shivajinagar, Pune, Maharashtra 411005, India.",
    quickContact: "Tel: +91 98765 43210\nFax: +91 98765 43210",
    email: "info@leelatours.com\ncontact@leelatours.com",
    whatsapp: "919876543210",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInfo = async () => {
      try {
        const res = await getContent();
        if (res.data?.success && res.data.content?.contact) {
          setContactInfo((prev) => ({
            ...prev,
            ...res.data.content.contact,
          }));
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const message = `Hello Leela Tours!
Name: ${formData.name || "Traveller"}
Email: ${formData.email || "N/A"}
Phone: ${formData.phone || "N/A"}
Query: ${formData.query || "I want to inquire about tours."}`;

    window.open(
      `https://wa.me/${contactInfo.whatsapp || "919876543210"}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.query,
        source: "contact_page",
      });

      toast.success("Thank you! Your inquiry has been submitted. We will contact you shortly.");
      setFormData({ name: "", email: "", phone: "", query: "" });
    } catch (err) {
      toast.error("Failed to submit inquiry. Please try again or message on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <section
          className="relative flex min-h-[220px] md:min-h-[260px] items-center justify-center bg-cover bg-center px-5 py-12 text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85')",
          }}
        >
          <div className="text-white max-w-2xl">
            <h1 className="font-caladea text-4xl sm:text-5xl font-bold tracking-tight">
              CONTACT US
            </h1>
            <p className="mt-3 font-montserrat text-sm sm:text-base text-gray-200">
              Planning your dream vacation? Get in touch with our expert travel planners. We are here to assist you 7 days a week.
            </p>
          </div>
        </section>

        {/* Contact Content Grid */}
        <section className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 py-14 md:grid-cols-2 lg:px-10">
          {/* Contact Details (Admin managed) */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center gap-2.5 text-[#07569b] font-caladea text-xl font-bold">
                <FaBuilding className="text-[#ff6500]" />
                <h2>Corporate Office</h2>
              </div>
              <p className="mt-2 font-montserrat text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {contactInfo.corporateOffice}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-5">
              <div className="flex items-center gap-2.5 text-[#07569b] font-caladea text-xl font-bold">
                <FaPhoneAlt className="text-[#ff6500]" />
                <h2>Quick Contact</h2>
              </div>
              <p className="mt-2 font-montserrat text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {contactInfo.quickContact}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[#07569b] font-caladea text-xl font-bold">
                <FaEnvelope className="text-[#ff6500]" />
                <h2>Email Address</h2>
              </div>
              <p className="mt-2 font-montserrat text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {contactInfo.email}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100">
            <h3 className="font-caladea text-2xl font-bold text-[#07569b] mb-1">
              Send us a Message
            </h3>
            <p className="font-montserrat text-xs text-gray-500 mb-6">
              Fill out the form below or chat directly on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-montserrat">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rajesh Kumar"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="query" className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Query or Travel Plan
                </label>
                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Tell us where you want to travel, dates, and number of people..."
                  className="w-full resize-y rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#ff6500] hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow transition disabled:opacity-50 cursor-pointer sm:flex-1"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#08a900] hover:bg-green-700 px-5 py-3 text-sm font-bold text-white shadow transition cursor-pointer sm:flex-1"
                >
                  <FaWhatsapp className="text-lg" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
