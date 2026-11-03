// import React from 'react'

// export default function contact() {
//   return (
//     <div>
//       <h2>contact</h2>
//     </div>
//   )
// }
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });

  const whatsappNumber = "919876543210";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsApp = () => {
    const message = `Hello Leela Tours!
Name: ${formData.name}
Email: ${formData.email}
Query: ${formData.query}`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleWhatsApp();
  };

  return (
    <main className="w-full bg-white font-montserrat text-gray-900">
      {/* Banner */}
      <section
        className="relative flex min-h-[168px] items-center justify-center bg-cover bg-center px-5 py-8 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85')",
        }}
      >
        <div className="text-white">
          <h1 className="text-4xl font-bold md:text-5xl">CONTACT US</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse varius enim in eros.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 py-7 md:grid-cols-2 md:gap-12 lg:px-10">
        {/* Contact Details */}
        <div className="pt-2">
          <div className="border-b border-gray-400 pb-2">
            <h2 className="mb-1 text-sm font-semibold">Corporate Office</h2>
            <p className="text-sm leading-6 text-gray-700">
              Office No. 204, 2nd Floor,
              <br />
              ABC Business Plaza, FC Road,
              <br />
              Shivajinagar, Pune, Maharashtra 411005, India.
            </p>
          </div>

          <div className="border-b border-gray-400 py-4">
            <h2 className="mb-1 text-sm font-semibold">Quick Contact</h2>
            <p className="text-sm leading-6 text-gray-700">
              Tel: +91 98765 43210
              <br />
              Fax: +91 98765 43210
            </p>
          </div>

          <div className="py-4">
            <h2 className="mb-1 text-sm font-semibold">Email Address</h2>
            <p className="text-sm leading-6 text-gray-700">
              Info@Leela Tours
              <br />
              Contact@LeelaTours.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_0_16px_rgba(0,0,0,0.20)] md:p-6">
          <form onSubmit={handleSubmit} className="space-y-1">
            <label htmlFor="name" className="block text-[11px]">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="mb-1 h-6 w-full rounded-md border border-gray-400 px-2 text-sm outline-none focus:border-blue-500"
            />

            <label htmlFor="email" className="block text-[11px]">
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mb-1 h-6 w-full rounded-md border border-gray-400 px-2 text-sm outline-none focus:border-blue-500"
            />

            <label htmlFor="query" className="block text-[11px]">
              Your Query
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              required
              rows="5"
              className="w-full resize-y rounded-md border border-gray-400 p-2 text-sm outline-none focus:border-blue-500"
            />

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="rounded-full bg-[#08a900] px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                ☎ Chat On WhatsApp
              </button>

              <button
                type="submit"
                className="rounded-full bg-orange-500 px-4 py-1.5 text-xs text-white hover:bg-orange-600"
              >
                Submit Now
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;