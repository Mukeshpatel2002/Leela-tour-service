import React from "react";
import whatsappIcon from "../../assets/whatsapp.png";
import { FaPhoneAlt } from "react-icons/fa";
import useContact from "../../hooks/useContact";

export default function TourCTA({ tour }) {
  const contactData = useContact();

  const destination = tour?.title?.replace(/^(Magical|Splendid|Royal|Mesmerizing)\s+/i, "") || "Kashmir";
  const bgImage =
    tour?.image ||
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";

  const whatsappMessage = encodeURIComponent(
    `Hello Leela Tours! I am interested in ${tour?.title || "your tour"}. Please hold my seats and share details.`
  );

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background with dark overlay matching Image 3 */}
      <div
        className="relative min-h-[380px] sm:min-h-[420px] w-full bg-cover bg-center py-16 px-5 flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 30, 20, 0.78), rgba(10, 30, 20, 0.78)), url('${bgImage}')`,
        }}
      >
        <div className="relative mx-auto max-w-[900px] text-white">
          {/* Main Title matching Image 3 */}
          <h2 className="font-caladea text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            {destination} Is Calling. Shall We?
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-[680px] font-montserrat text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed">
            Send Us A Message And We Will Hold Your Seats While You Decide.
            <br className="hidden sm:inline" /> No Payment Needed To Ask.
          </p>

          {/* Call-to-action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Book on WhatsApp Green Button */}
            <a
              href={`https://wa.me/${contactData.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#08a900] hover:bg-[#078e00] px-8 py-4 font-montserrat text-base sm:text-lg font-bold text-white shadow-xl transition transform hover:-translate-y-0.5"
            >
              <img
                src={whatsappIcon}
                alt=""
                className="h-6 w-6 object-contain"
              />
              <span>Book On Whatsapp</span>
            </a>

            {/* Phone Button */}
            <a
              href={`tel:${contactData.phone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-white hover:bg-gray-100 px-8 py-4 font-montserrat text-base sm:text-lg font-bold text-gray-900 shadow-xl transition transform hover:-translate-y-0.5"
            >
              <FaPhoneAlt className="text-gray-800 text-lg" />
              <span>{contactData.phone}</span>
            </a>
          </div>

          {/* Bottom Features */}
          <p className="mt-8 font-montserrat text-xs sm:text-sm text-gray-300 tracking-wide">
            Quick Response • Easy Booking • Expert Assistance
          </p>
        </div>
      </div>
    </section>
  );
}
