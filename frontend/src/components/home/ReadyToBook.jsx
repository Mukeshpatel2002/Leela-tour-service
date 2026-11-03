import React from "react";
import whatsappIcon from "../../assets/whatsapp.png";
import { FaPhoneAlt } from "react-icons/fa";
import useContact from "../../hooks/useContact";

export default function ReadyToBook() {
  const contact = useContact();
  const telHref = `tel:${contact.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1400px] rounded-[32px] bg-gradient-to-r from-[#ff6500] to-[#ff8500] px-6 py-12 text-center sm:px-12 sm:py-16 shadow-2xl">
        <h2 className="font-caladea text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white underline decoration-2 underline-offset-8">
          Ready To Book Your Trip?
        </h2>

        <p className="mx-auto mt-5 max-w-[850px] font-montserrat text-base sm:text-xl md:text-2xl leading-relaxed text-orange-100">
          Share Your Tour Details With Us On WhatsApp And Our Team Will Help You Complete Your Booking.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
              "Hello Leela Tours, I want to book a trip."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book your trip on WhatsApp"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#08a900] hover:bg-green-700 px-8 py-3.5 text-lg sm:text-xl font-bold text-white transition shadow-lg"
          >
            <img
              src={whatsappIcon}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span>Book On WhatsApp</span>
          </a>

          <a
            href={telHref}
            aria-label="Call Leela Tours"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-white hover:bg-orange-50 px-8 py-3.5 text-lg sm:text-xl font-bold text-gray-900 transition shadow-lg"
          >
            <FaPhoneAlt className="text-xl text-orange-600 shrink-0" />
            <span>{contact.phone}</span>
          </a>
        </div>

        <p className="mt-6 font-montserrat text-sm sm:text-base md:text-lg text-orange-100 font-medium">
          Quick Response • Easy Booking • Expert Assistance
        </p>
      </div>
    </section>
  );
}
