import React from "react";
import {
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaUtensils,
  FaHome,
} from "react-icons/fa";

export default function TourOverview({ tour }) {
  if (!tour) return null;

  const highlights = tour.highlights || {};

  const infoItems = [
    {
      icon: <FaClock className="text-xl text-[#ff6500]" />,
      label: "Duration",
      value: highlights.durationText || tour.duration || "6 days, 5 nights",
    },
    {
      icon: <FaUsers className="text-xl text-[#ff6500]" />,
      label: "Group size",
      value: highlights.groupSize || "Up to 30 travellers",
    },
    {
      icon: <FaMapMarkerAlt className="text-xl text-[#ff6500]" />,
      label: "Starts and ends",
      value: highlights.startEnd || tour.departureCity || "Srinagar airport",
    },
    {
      icon: <FaUtensils className="text-xl text-[#ff6500]" />,
      label: "Meals",
      value: highlights.meals || "Breakfast and dinner",
    },
    {
      icon: <FaHome className="text-xl text-[#ff6500]" />,
      label: "Stay",
      value: highlights.stay || "Houseboat and 3 star hotels",
    },
  ];

  return (
    <div className="w-full">
      {/* Section Header matching Image 2 */}
      <div className="mb-6">
        <h2 className="font-caladea text-3xl sm:text-4xl font-bold leading-tight text-[#07569b]">
          Your Journey, Day by Day
        </h2>
        <p className="font-montserrat text-sm font-semibold text-[#ff6500]">
          {tour.subHeading || "itinerary-focused"}
        </p>
        <p className="mt-1 font-montserrat text-sm font-medium text-[#ff6500]">
          {tour.dateSubtitle || `${tour.duration} · Upcoming departure`}
        </p>
        <h3 className="mt-1 font-caladea text-2xl sm:text-3xl font-bold text-[#ff6500]">
          {tour.title}
        </h3>
      </div>

      {/* Information Cards */}
      <div className="flex flex-col gap-3.5">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-gray-200/90 bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-md"
          >
            {/* Orange Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              {item.icon}
            </div>

            {/* Vertical Divider Line */}
            <div className="h-8 w-[1px] bg-gray-200" />

            {/* Text details */}
            <div className="min-w-0">
              <p className="font-montserrat text-xs font-medium text-gray-500">
                {item.label}
              </p>
              <p className="font-montserrat text-base font-bold text-gray-900 leading-snug">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
