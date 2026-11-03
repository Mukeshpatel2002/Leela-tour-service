// import React from 'react'

// export default function why() {
//   return (
//     <div>
//       <h2>Why choose us</h2>
//     </div>
//   )
// }
import whyImage from "../assets/why.jpg";
import traveler1 from "../assets/traveler1.png";
import traveler2 from "../assets/traveler2.png";
import traveler3 from "../assets/traveler3.png";
import traveler4 from "../assets/traveler4.jpg";

const features = [
  {
    title: "Tour manager on every trip",
    description: "One friendly person who handles everything, so you just enjoy.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
        <path d="m8 2 2 2M16 2l-2 2" />
      </>
    ),
  },
  {
    title: "No hidden costs",
    description: "The price we quote is the price you pay. Everything is in writing.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="1" />
        <circle cx="12" cy="12.5" r="3" />
        <path d="M6 9h1M17 16h1" />
      </>
    ),
  },
  {
    title: "Handpicked stays",
    description: "Clean, comfortable hotels we have checked ourselves.",
    icon: (
      <>
        <path d="M3 11 12 3l9 8" />
        <path d="M5 10v11h14V10M9 21v-6h6v6" />
        <path d="M9 11h.01M15 11h.01" />
      </>
    ),
  },
  {
    title: "Small, friendly groups",
    description: "Most groups have 20 to 30 people, so it never feels crowded.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2z" />
        <path d="M16 14a5 5 0 0 1 5 5v1h-4" />
      </>
    ),
  },
];

const travelers = [traveler1, traveler2, traveler3, traveler4];

function Why() {
  return (
    <section className="w-full bg-[#fff4ec] py-12 md:py-16">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10">

        {/* Left: Travel Image */}
        <div className="relative min-w-0">
          <div className="relative h-[380px] overflow-hidden rounded-[28px] shadow-md sm:h-[460px] lg:h-[565px]">
            <img
              src={whyImage}
              alt="Travellers enjoying an outdoor adventure"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Travellers Card */}
          <div className="absolute bottom-8 left-1/2 flex w-[88%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-lg sm:bottom-12 sm:w-[82%] sm:gap-5 sm:px-6 sm:py-5">
            {/* Traveller Profile Images */}
            <div className="flex shrink-0 items-center">
              {travelers.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Traveller ${index + 1}`}
                  className={`relative h-10 w-10 rounded-full border-2 border-white object-cover sm:h-14 sm:w-14 ${
                    index > 0 ? "-ml-3 sm:-ml-4" : ""
                  }`}
                  style={{ zIndex: travelers.length - index }}
                />
              ))}
            </div>

            <div className="min-w-0">
              <h3 className="font-caladea text-lg font-bold leading-tight text-[#07569b] sm:text-2xl">
                120+ travellers
              </h3>
              <p className="mt-1 font-montserrat text-[10px] leading-4 text-gray-600 sm:text-xs">
                booked with us this month
              </p>
            </div>
          </div>
        </div>

        {/* Right: Why Choose Us */}
        <div className="min-w-0">
          <p className="font-montserrat text-xl font-semibold uppercase tracking-wide text-orange-500 sm:text-2xl md:text-3xl">
            Why Leela Tours
          </p>

          <h2 className="mt-1 font-caladea text-4xl font-bold leading-[1.08] text-[#07569b] sm:text-5xl">
            Travel like family,{" "}
            <span className="text-orange-500">not like a tourist</span>
          </h2>

          <p className="mt-3 font-montserrat text-sm leading-6 text-gray-500 sm:text-base">
            For over 10 years we have taken families, couples, students and
            seniors across India. We take care of the details so your only job
            is to enjoy the trip.
          </p>

          {/* Four Feature Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border-2 border-[#ffddc8] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md sm:min-h-[135px] sm:p-5"
              >
                {/* Orange Icon */}
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-[#ffeadb]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff6900"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </div>

                <h3 className="font-caladea text-lg font-bold leading-tight text-[#07569b] sm:text-xl">
                  {feature.title}
                </h3>

                <p className="mt-1 font-montserrat text-xs leading-[1.5] text-gray-500 sm:text-[13px]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Why;