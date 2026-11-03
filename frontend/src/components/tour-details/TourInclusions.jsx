import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function TourInclusions({ tour }) {
  if (!tour) return null;

  const defaultInclusions = [
    "5 nights stay, including 1 night on a houseboat",
    "Breakfast and dinner every day",
    "Private vehicle for all sightseeing",
    "Shikara ride on Dal Lake",
    "Airport pickup and drop in Srinagar",
    "Tour manager with the group all 6 days",
    "All tolls, parking and driver charges",
  ];

  const defaultExclusions = [
    "Flights or trains to Srinagar",
    "Gondola tickets and pony rides",
    "Lunch and personal expenses",
    "Travel insurance",
    "Anything not listed as included",
  ];

  const inclusions = tour.inclusions?.length ? tour.inclusions : defaultInclusions;
  const exclusions = tour.exclusions?.length ? tour.exclusions : defaultExclusions;

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Heading matching Image 4 */}
        <h2 className="text-center font-caladea text-4xl sm:text-5xl font-bold text-[#07569b] mb-10">
          What's included
        </h2>

        {/* 2 Side-by-side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card: In your price (Light blue) */}
          <div className="rounded-[28px] bg-[#ebf6fd] p-7 sm:p-9 shadow-sm border border-blue-100/60">
            <h3 className="font-montserrat text-xl sm:text-2xl font-bold text-[#ff6500] mb-6">
              In your price
            </h3>

            <ul className="space-y-4">
              {inclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#82e0aa]/40 text-[#1e8449] font-bold text-xs mt-0.5">
                    <FaCheck />
                  </span>
                  <span className="font-montserrat text-sm sm:text-base font-medium text-gray-800 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Card: Not included (Light peach) */}
          <div className="rounded-[28px] bg-[#fff3ea] p-7 sm:p-9 shadow-sm border border-orange-100/60">
            <h3 className="font-montserrat text-xl sm:text-2xl font-bold text-[#ff6500] mb-6">
              Not included
            </h3>

            <ul className="space-y-4">
              {exclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5b7b1]/40 text-[#c0392b] font-bold text-xs mt-0.5">
                    <FaTimes />
                  </span>
                  <span className="font-montserrat text-sm sm:text-base font-medium text-gray-800 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
