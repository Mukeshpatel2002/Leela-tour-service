import React, { useState } from "react";
import whatsappIcon from "../../assets/whatsapp.png";
import { submitEnquiry } from "../../api/api";
import { FaChevronDown } from "react-icons/fa";
import useContact from "../../hooks/useContact";

export default function TourBookingCard({ tour }) {
  const contact = useContact();

  const defaultDates = tour?.departureDates?.length
    ? tour.departureDates.map((d) => d.date)
    : ["24 Oct 2026 (4 seat left)", "05 Nov 2026 (6 seats left)", "18 Nov 2026 (8 seats left)"];

  const [selectedDate, setSelectedDate] = useState(defaultDates[0]);
  const [travellers, setTravellers] = useState(2);

  if (!tour) return null;

  const pricePerPerson = tour.price || 24999;
  const oldPricePerPerson = tour.oldPrice || 28999;

  const estimatedTotal = pricePerPerson * travellers;
  const totalSavings = Math.max(0, (oldPricePerPerson - pricePerPerson) * travellers);

  const handleBooking = async () => {
    // Record enquiry in backend for Admin to track
    try {
      await submitEnquiry({
        name: `Guest (${travellers} Travellers)`,
        tourTitle: tour.title,
        departureDate: selectedDate,
        travellers,
        estimatedTotal,
        message: `Booked via WhatsApp click for ${tour.title} on ${selectedDate} with ${travellers} travellers.`,
        source: "whatsapp_click",
      });
    } catch (err) {
      // Non-blocking
    }

    const message = `Hello Leela Tours!
I would like to book the following tour:
*Tour:* ${tour.title} (${tour.duration})
*Departure Date:* ${selectedDate}
*Travellers:* ${travellers} Person(s)
*Estimated Total:* ₹${estimatedTotal.toLocaleString("en-IN")}
Please confirm seat availability and booking steps.`;

    window.open(
      `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="sticky top-28 w-full max-w-[450px] overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xl">
      {/* Top Header matching Image 2 */}
      <div className="bg-[#034579] px-6 py-5 text-white">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-sky-200">
          STARTING FROM
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-montserrat text-3xl font-extrabold text-white">
            ₹{pricePerPerson.toLocaleString("en-IN")}
          </span>
          {oldPricePerPerson > pricePerPerson && (
            <span className="font-montserrat text-base text-sky-300/80 line-through">
              ₹{oldPricePerPerson.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <p className="mt-0.5 font-montserrat text-xs text-sky-200">per person</p>
      </div>

      {/* Body Section */}
      <div className="p-6">
        {/* Departure City */}
        <div className="flex items-center justify-between border-b border-gray-100 py-2.5 font-montserrat text-sm">
          <span className="text-gray-500">Departure City</span>
          <span className="font-semibold text-gray-900">
            {tour.departureCity || "Srinagar airport"}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between border-b border-gray-100 py-2.5 font-montserrat text-sm">
          <span className="text-gray-500">Duration</span>
          <span className="font-semibold text-gray-900">
            {tour.highlights?.durationText || tour.duration || "6 days / 5 nights"}
          </span>
        </div>

        {/* Departure Date Selector */}
        <div className="mt-4">
          <label className="block font-montserrat text-xs font-semibold text-gray-700 mb-1.5">
            Departure Date
          </label>
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-8 font-montserrat text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {defaultDates.map((dateStr, i) => (
                <option key={i} value={dateStr}>
                  {dateStr}
                </option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
          </div>
        </div>

        {/* Travellers Counter */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-300 p-2">
          <span className="pl-2 font-montserrat text-sm font-semibold text-gray-800">
            Travellers
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTravellers((prev) => Math.max(1, prev - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-bold transition hover:bg-sky-200 cursor-pointer"
              aria-label="Decrease travellers"
            >
              -
            </button>
            <span className="font-montserrat text-sm font-bold text-gray-900 min-w-4 text-center">
              {travellers}
            </span>
            <button
              type="button"
              onClick={() => setTravellers((prev) => Math.min(30, prev + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-bold transition hover:bg-sky-200 cursor-pointer"
              aria-label="Increase travellers"
            >
              +
            </button>
          </div>
        </div>

        {/* Booking Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between font-montserrat text-xs">
            <span className="text-gray-500">{tour.bookedPercent || 87}% booked</span>
            <span className="font-bold text-red-600">
              Only {tour.seatsLeft || 4} seats left
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#ff6500]"
              style={{ width: `${tour.bookedPercent || 87}%` }}
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-5 border-t border-dashed border-gray-200 pt-3 font-montserrat text-xs">
          <div className="flex justify-between text-gray-600">
            <span>
              ₹{pricePerPerson.toLocaleString("en-IN")} × {travellers} travellers
            </span>
            <span className="font-semibold text-gray-800">
              ₹{estimatedTotal.toLocaleString("en-IN")}
            </span>
          </div>

          {totalSavings > 0 && (
            <div className="mt-1 flex justify-between font-semibold text-emerald-600">
              <span>You Save</span>
              <span>₹{totalSavings.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>

        {/* Estimated Total */}
        <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
          <span className="font-montserrat text-sm font-semibold text-gray-700">
            Estimated total
          </span>
          <span className="font-montserrat text-2xl sm:text-3xl font-extrabold text-[#034579]">
            ₹{estimatedTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Book on WhatsApp Green Button */}
        <button
          type="button"
          onClick={handleBooking}
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0ba300] hover:bg-[#098e00] px-4 py-3.5 font-montserrat text-base font-bold text-white shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <img
            src={whatsappIcon}
            alt=""
            className="h-5 w-5 object-contain shrink-0"
          />
          <span>Book on Whatsapp</span>
        </button>

        <p className="mt-2 text-center font-montserrat text-[11px] text-gray-400">
          No payment now. We confirm seats and final price on WhatsApp.
        </p>

        {/* View Reviews CTA */}
        <button
          type="button"
          onClick={() => {
            const reviewSection = document.getElementById("tour-reviews");
            if (reviewSection) {
              reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#07569b] bg-white hover:bg-blue-50 py-2.5 px-4 font-montserrat text-xs sm:text-sm font-bold text-[#07569b] transition shadow-xs hover:shadow-md cursor-pointer"
        >
          <span className="text-amber-500 text-sm">★</span>
          <span>View Reviews</span>
          <span className="text-xs transition-transform group-hover:translate-y-0.5">↓</span>
        </button>

        {/* Trust Points */}
        <div className="mt-5 border-t border-gray-100 pt-4 font-montserrat text-xs text-gray-700 space-y-2">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            No hidden costs, everything in writing
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            Hold your seat with a small advance
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            Reply within 10 minutes, 9am to 9pm
          </p>
        </div>
      </div>
    </div>
  );
}
