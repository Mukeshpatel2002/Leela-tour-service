// import React from 'react'

// export default function hero() {
//   return (
//     <div>
//       <h2>hero</h2>
//     </div>
//   )
// }

import { useState } from "react";
import heroImage from "../assets/banner1.jpg";
import whatsappIcon from "../assets/whatsapp.png";

function Hero() {
  const [destination, setDestination] = useState("Magical kashmir");
  const [month, setMonth] = useState("2026-11");
  const [travellers, setTravellers] = useState(2);

  const handleQuote = (e) => {
    e.preventDefault();

    const message = `Hello Leela Tours! I want a free trip quote.
Destination: ${destination}
Travel Month: ${month}
Travellers: ${travellers}`;

    window.open(
      `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const stats = [
    { number: "500+", label: "Happy Travellers" },
    { number: "40+", label: "Tour Packages" },
    { number: "20+", label: "Destinations" },
    { number: "10+", label: "Years of Experience" },
  ];

  return (
    <section className="relative mb-16 w-full">
      {/* Hero Background */}
      <div
        className="relative min-h-[490px] bg-cover bg-center bg-no-repeat md:min-h-[450px]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-5 py-7 md:min-h-[390px] md:flex-row md:items-start md:justify-end md:px-10">
          {/* Quote Form */}
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-xl md:mr-[5%] md:mt-0">
            <h1 className="font-caladea text-[22px] font-bold leading-6 text-[#07569b]">
              Get your trip price in 2 minutes
            </h1>

            <p className="mb-4 mt-1 text-[12px] leading-4 text-gray-600">
              Tell us a little and we'll send the best price on WhatsApp.
              Free, no obligation.
            </p>

            <form onSubmit={handleQuote} className="space-y-3">
              {/* Destination */}
              <div>
                <label className="mb-1 block text-[12px] font-medium">
                  Where do you want to go?
                </label>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  placeholder="Enter destination"
                  className="h-7 w-full rounded border border-gray-300 px-2 text-[13px] outline-none focus:border-blue-500"
                />
              </div>

              {/* Travel Month and Travellers */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium">
                    When?
                  </label>

                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                    className="h-7 w-full rounded border border-gray-300 px-1 text-[12px] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium">
                    Travellers
                  </label>

                  <div className="flex h-7 items-center justify-between rounded border border-gray-300 px-1">
                    <button
                      type="button"
                      onClick={() =>
                        setTravellers((n) => Math.max(1, n - 1))
                      }
                      className="rounded bg-sky-100 px-2 text-xs text-sky-700"
                      aria-label="Decrease travellers"
                    >
                      -
                    </button>

                    <span className="text-[11px]">{travellers}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setTravellers((n) => Math.min(30, n + 1))
                      }
                      className="rounded bg-sky-100 px-2 text-xs text-sky-700"
                      aria-label="Increase travellers"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quote Button */}
              <button
                type="submit"
                className="flex h-7 w-full items-center justify-center gap-2 rounded-full bg-[#08a000] text-[11px] font-semibold text-white transition hover:bg-green-700"
              >
                <img
                  src={whatsappIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 object-contain"
                />

                Get my free Quote
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-gray-600">
              🔒 We never share your number. No spam, ever.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="relative z-10 mx-auto -mt-8 grid w-[90%] max-w-[1200px] grid-cols-2 rounded-2xl border-2 border-blue-200 bg-white/95 px-3 py-5 shadow-lg md:-mt-[60px] md:grid-cols-4 md:px-5 md:py-7">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center px-2 py-2 text-center ${
              index < 3 ? "md:border-r-2 md:border-sky-500" : ""
            } ${
              index < 2
                ? "border-b-2 border-sky-500 md:border-b-0"
                : ""
            }`}
          >
            <span className="text-[25px] font-extrabold leading-8 text-orange-500 md:text-[27px]">
              {item.number}
            </span>

            <span className="text-[12px] text-gray-900 md:text-[15px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;