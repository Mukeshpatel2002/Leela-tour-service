import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTours } from "../../api/api";
import tripImageFallback from "../../assets/trip.jpg";
import whatsappIcon from "../../assets/whatsapp.png";
import useContact from "../../hooks/useContact";

function TripCard({ trip }) {
  const contact = useContact();
  const whatsappMessage = encodeURIComponent(
    `Hello Leela Tours! I am interested in ${trip.title} (${trip.duration}). Please share full details and seat availability.`
  );

  const discount = Math.max(0, (trip.oldPrice || 0) - (trip.price || 0));

  return (
    <article className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between">
      {/* Trip Image */}
      <div>
        <div className="relative h-[220px] overflow-hidden bg-gray-100">
          <img
            src={trip.image || tripImageFallback}
            alt={trip.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = tripImageFallback;
            }}
          />

          <span className="absolute left-3 top-3 rounded-full bg-[#ff6500] px-3 py-1 font-montserrat text-[13px] font-semibold text-white shadow">
            {trip.badge || "Best Seller"}
          </span>

          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 font-montserrat text-[13px] font-bold text-[#07569b] shadow">
            {trip.duration}
          </span>
        </div>

        {/* Trip Details */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-montserrat text-[13px] font-semibold text-gray-500 uppercase tracking-wide">
              {trip.category || "Mountains"}
            </span>

            <span className="whitespace-nowrap font-montserrat text-[13px] text-gray-700 font-medium">
              ★ {trip.rating || 4.9} ({trip.reviewsCount || 126} reviews)
            </span>
          </div>

          <h3 className="mt-1 font-caladea text-[24px] font-bold leading-7 text-[#07569b]">
            {trip.title}
          </h3>

          <p className="truncate font-montserrat text-[14px] text-gray-500 mt-0.5">
            {trip.route || trip.location || "Srinagar · Gulmarg · Pahalgam"}
          </p>

          {/* Booking Progress */}
          <div className="mt-3">
            <div className="mb-1 flex justify-between gap-2 font-montserrat text-[12px] text-gray-600">
              <span>{trip.bookedPercent || 82}% booked</span>
              <span className="font-semibold text-red-600">
                Only {trip.seatsLeft || 4} seats left
              </span>
            </div>

            <div className="h-[6px] overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#ff6500]"
                style={{ width: `${trip.bookedPercent || 82}%` }}
              />
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <p className="font-montserrat text-[12px] text-gray-500">Starting from</p>

              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-montserrat text-[22px] font-extrabold leading-6 text-black">
                  ₹{trip.price?.toLocaleString("en-IN")}
                </span>

                {trip.oldPrice > trip.price && (
                  <span className="font-montserrat text-[13px] text-gray-400 line-through">
                    ₹{trip.oldPrice?.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <p className="font-montserrat text-[11px] text-gray-500">per person</p>
            </div>

            {discount > 0 && (
              <span className="mb-1 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 font-montserrat text-[12px] font-semibold text-green-700">
                Save ₹{discount.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0">
        <div className="flex items-center gap-2">
          {/* View Details Link */}
          <Link
            to={`/tour/${trip._id}`}
            className="flex-1 rounded-full border border-gray-400 px-3 py-2 text-center font-montserrat text-[13px] font-semibold text-gray-900 transition hover:bg-gray-100 shadow-xs"
          >
            View Details
          </Link>

          {/* WhatsApp Direct Book */}
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#08a900] hover:bg-[#078e00] px-3 py-2 font-montserrat text-[13px] font-semibold text-white shadow-xs transition"
          >
            <img
              src={whatsappIcon}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 shrink-0 object-contain"
            />
            Book on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export { TripCard };

export default function TripSection({
  tourType,
  category,
  toursData = null,
  title = "Trips leaving soon",
  subtitle = "Upcoming Departures",
  description = "Fixed dates, small groups and seats that fill up fast. Pick your trip and lock your seat on WhatsApp.",
  hideHeader = false,
  emptyMessage = "No tours available at the moment.",
}) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(!toursData);
  const contact = useContact();

  useEffect(() => {
    if (toursData) {
      setTours(toursData);
      setLoading(false);
      return;
    }

    const fetchTours = async () => {
      try {
        setLoading(true);
        const params = {};
        if (tourType) params.tourType = tourType;
        if (category && category !== "all") params.category = category;
        if (!tourType && !category) params.featured = "true";

        const res = await getTours(params);
        if (res.data?.success) {
          setTours(res.data.tours || []);
        }
      } catch (err) {
        console.error("Error loading tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [tourType, category, toursData]);

  return (
    <section id="trips-section" className="mx-auto mt-12 mb-20 w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      {/* Section Heading */}
      {!hideHeader && (
        <div className="mb-8">
          {subtitle && (
            <p className="font-montserrat text-[18px] sm:text-[20px] font-bold uppercase tracking-wide text-[#ff6500]">
              {subtitle}
            </p>
          )}

          {title && (
            <h2 className="font-caladea text-[36px] sm:text-[48px] md:text-[54px] font-bold leading-tight text-[#07569b]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-2 max-w-[620px] font-montserrat text-[16px] sm:text-[18px] leading-[1.5] text-gray-700">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Grid of Tours */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : tours.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-lg font-semibold font-montserrat text-gray-700">
            {emptyMessage}
          </p>
          <p className="mt-1 font-montserrat text-sm text-gray-500">
            Need a custom package for this category? Contact our travel expert directly on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
              "Hello Leela Tours! I am looking for a tour package."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#08a900] px-6 py-2.5 font-montserrat text-sm font-semibold text-white shadow hover:bg-green-700 transition"
          >
            Chat with Tour Expert
          </a>
        </div>
      )}
    </section>
  );
}
