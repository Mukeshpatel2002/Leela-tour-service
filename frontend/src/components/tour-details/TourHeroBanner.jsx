import React from "react";
import whatsappIcon from "../../assets/whatsapp.png";
import useContact from "../../hooks/useContact";

export default function TourHeroBanner({ tour }) {
  const contact = useContact();
  if (!tour) return null;

  const discount = Math.max(0, (tour.oldPrice || 0) - (tour.price || 0));
  const bookedPercent = tour.bookedPercent || 85;
  const seatsLeft = tour.seatsLeft || 4;

  const whatsappMessage = encodeURIComponent(
    `Hello Leela Tours! I am interested in ${tour.title} (${tour.duration}). Starting price ₹${tour.price?.toLocaleString("en-IN")} per person. Please share availability and full booking details.`
  );

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {/* Background Scenic Landscape */}
      <div
        className="relative min-h-[480px] sm:min-h-[520px] md:min-h-[580px] w-full bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${tour.image || "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80"})`,
        }}
      >
        {/* Soft gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/15 to-black/40" />

        {/* Content Container */}
        <div className="relative mx-auto flex min-h-[480px] sm:min-h-[520px] md:min-h-[580px] max-w-[1400px] items-center justify-end px-5 py-10 md:px-12">
          {/* Floating White Card */}
          <div className="w-full max-w-[490px] rounded-[28px] bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-white/60 backdrop-blur-xs">
            {/* Top row: Title + Duration pill */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-caladea text-3xl sm:text-4xl font-bold tracking-tight text-[#07569b]">
                  {tour.title}
                </h1>
                <p className="mt-1 font-montserrat text-sm font-medium text-gray-500">
                  {tour.route}
                </p>
              </div>

              {/* Orange Duration Badge */}
              <span className="shrink-0 rounded-full bg-[#ff6500] px-3.5 py-1.5 font-montserrat text-xs sm:text-sm font-bold text-white shadow-sm">
                {tour.duration}
              </span>
            </div>

            {/* SEAT AVAILABILITY PROGRESS BAR (Replaced the S share icon) */}
            <div className="mt-5 rounded-2xl bg-orange-50/80 p-3.5 border border-orange-100">
              <div className="flex items-center justify-between font-montserrat text-xs mb-1.5">
                <span className="font-semibold text-gray-700">
                  {bookedPercent}% Booked
                </span>
                <span className="font-bold text-red-600">
                  Only {seatsLeft} seats left!
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff6500] to-[#ff8500] transition-all duration-500"
                  style={{ width: `${bookedPercent}%` }}
                />
              </div>
              <p className="mt-1.5 font-montserrat text-[11px] text-gray-500">
                Small group tour — seats filling fast on WhatsApp
              </p>
            </div>

            {/* Pricing Section */}
            <div className="mt-5">
              <p className="font-montserrat text-xs text-gray-500 font-medium">Starting from</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="font-montserrat text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                  ₹{tour.price?.toLocaleString("en-IN")}
                </span>

                {tour.oldPrice > tour.price && (
                  <span className="font-montserrat text-lg sm:text-xl text-gray-400 line-through">
                    ₹{tour.oldPrice?.toLocaleString("en-IN")}
                  </span>
                )}

                {discount > 0 && (
                  <span className="rounded-full bg-[#e8fbf0] px-3 py-1 font-montserrat text-xs sm:text-sm font-semibold text-[#16a34a]">
                    Save ₹{discount.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="mt-1 font-montserrat text-xs text-gray-500">per person</p>
            </div>

            {/* Book on WhatsApp Green Button */}
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#0ba300] hover:bg-[#098e00] px-6 py-3.5 font-montserrat text-base sm:text-lg font-bold text-white shadow-lg transition duration-200 transform hover:-translate-y-0.5"
            >
              <img
                src={whatsappIcon}
                alt=""
                className="h-6 w-6 object-contain shrink-0"
              />
              <span>Book on Whatsapp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
