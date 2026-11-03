// import React from 'react'

// export default function themed() {
//   return (
//     <div>
//       <h2>themed tour section</h2>
//     </div>
//   )
// }
import { useRef } from "react";
import schoolImage from "../assets/banner1.jpg";
import religiousImage from "../assets/hero.png";
import seniorImage from "../assets/trip.jpg";

const themedTours = [
  {
    id: 1,
    category: "Young Explorers",
    title: "School Trips",
    image: schoolImage,
    link: "/themed-tour/school-trips",
  },
  {
    id: 2,
    category: "Sacred Journey",
    title: "Religious Tour",
    image: religiousImage,
    link: "/themed-tour/religious-tour",
  },
  {
    id: 3,
    category: "Comfort Journey",
    title: "Senior Tour",
    image: seniorImage,
    link: "/themed-tour/senior-tour",
  },
  {
    id: 4,
    category: "Adventure Awaits",
    title: "Adventure Tours",
    image: schoolImage,
    link: "/themed-tour/adventure-tours",
  },
  {
    id: 5,
    category: "Travel Together",
    title: "Family Tours",
    image: religiousImage,
    link: "/themed-tour/family-tours",
  },
  {
    id: 6,
    category: "Love & Explore",
    title: "Honeymoon Tours",
    image: seniorImage,
    link: "/themed-tour/honeymoon-tours",
  },
];

function Themed() {
  const scrollRef = useRef(null);

  const scrollTours = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * scrollRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full overflow-hidden bg-white py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mb-7 text-center">
          <p className="font-montserrat text-lg font-semibold uppercase tracking-wide text-orange-500">
            Themed Tours
          </p>

          <h2 className="mt-1 font-caladea text-3xl font-bold leading-tight text-[#07569b] sm:text-4xl md:text-[40px]">
            A trip made for{" "}
            <span className="text-orange-500">who you travel with</span>
          </h2>

          <p className="mt-2 font-montserrat text-sm text-gray-500 sm:text-base">
            Every group is different. Choose a tour planned around your needs,
            pace and budget.
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollTours(-1)}
            aria-label="Previous tours"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white"
          >
            &#8592;
          </button>

          <button
            type="button"
            onClick={() => scrollTours(1)}
            aria-label="Next tours"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white"
          >
            &#8594;
          </button>
        </div>

        {/* Horizontal Cards */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 sm:gap-5"
          style={{ scrollbarWidth: "none" }}
        >
          {themedTours.map((tour) => (
            <article
              key={tour.id}
              className="group relative h-[300px] min-w-0 flex-[0_0_88%] snap-start overflow-hidden rounded-2xl shadow-md sm:h-[340px] sm:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)]"
            >
              <img
                src={tour.image}
                alt={tour.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001c34] via-[#001c34]/35 to-transparent" />

              {/* Card Text */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="font-montserrat text-xs font-medium text-white sm:text-sm">
                  {tour.category}
                </p>

                <h3 className="mt-1 font-caladea text-3xl font-bold leading-tight text-white sm:text-[32px]">
                  {tour.title}
                </h3>

                <a
                  href={tour.link}
                  className="mt-2 inline-flex items-center gap-2 font-montserrat text-sm font-medium text-white transition hover:text-orange-300 sm:text-base"
                >
                  View Details <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Themed;