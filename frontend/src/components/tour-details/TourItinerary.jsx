import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function TourItinerary({ tour }) {
  if (!tour || !tour.itinerary?.length) return null;

  // By default expand Day 1
  const [openDay, setOpenDay] = useState(1);

  const toggleDay = (dayNum) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-[1000px]">
        {/* Section Heading matching Image 3 */}
        <div className="text-center mb-10">
          <p className="font-montserrat text-sm font-bold uppercase tracking-wider text-[#ff6500]">
            YOUR TRIP, DAY BY DAY
          </p>
          <h2 className="mt-2 font-caladea text-3xl sm:text-4xl md:text-5xl font-bold text-[#07569b]">
            Experience the Best of {tour.title?.replace("Magical ", "") || "Kashmir"}
          </h2>
        </div>

        {/* Itinerary Accordion Rows */}
        <div className="flex flex-col gap-4">
          {tour.itinerary.map((item) => {
            const isOpen = openDay === item.day;

            return (
              <div
                key={item.day}
                className="flex items-start gap-3 sm:gap-4 transition-all"
              >
                {/* Peach / Orange Day Badge on Left */}
                <div className="flex h-[72px] w-[62px] sm:w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#ffe9db] text-gray-900 shadow-xs">
                  <span className="font-montserrat text-[11px] font-bold uppercase tracking-wide text-gray-700">
                    DAY
                  </span>
                  <span className="font-montserrat text-2xl font-extrabold leading-none text-black">
                    {item.day}
                  </span>
                </div>

                {/* Right White Card */}
                <div
                  className={`flex-1 overflow-hidden rounded-2xl border bg-white shadow-xs transition duration-200 ${
                    isOpen ? "border-orange-300 shadow-md" : "border-gray-200/90 hover:border-gray-300"
                  }`}
                >
                  {/* Card Header clickable */}
                  <div
                    onClick={() => toggleDay(item.day)}
                    className="flex cursor-pointer items-center justify-between px-5 py-4 select-none"
                  >
                    <div>
                      <h3 className="font-montserrat text-base sm:text-lg font-bold text-[#ff6500]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 font-montserrat text-xs text-gray-500">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{item.location || "Srinagar"}</span>
                      </p>
                    </div>

                    {/* Blue Round Plus/Minus Button matching Image 3 */}
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dbeefe] text-[#07569b] font-bold text-lg transition hover:bg-[#cbe6fd]"
                      aria-label={isOpen ? "Collapse day details" : "Expand day details"}
                    >
                      {isOpen ? "−" : "+"}
                    </button>
                  </div>

                  {/* Expanded Content Details */}
                  {isOpen && (
                    <div className="border-t border-orange-100 bg-orange-50/20 px-5 py-4 font-montserrat text-sm text-gray-700 space-y-3">
                      <p className="leading-relaxed">
                        {item.description || "Detailed schedule will be coordinated by our dedicated tour manager."}
                      </p>

                      {(item.stay || item.meals) && (
                        <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-600 border-t border-gray-100">
                          {item.stay && (
                            <span className="rounded-md bg-white border border-gray-200 px-2.5 py-1">
                              <strong>Stay:</strong> {item.stay}
                            </span>
                          )}
                          {item.meals && (
                            <span className="rounded-md bg-white border border-gray-200 px-2.5 py-1">
                              <strong>Meals:</strong> {item.meals}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
