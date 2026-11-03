
import { useEffect, useState } from "react";
import whatsappIcon from "../assets/whatsapp.png";

function Steps() {
  const [timeLeft, setTimeLeft] = useState({
    days: 21,
    hours: 7,
    mins: 25,
    secs: 38,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (
          prev.days === 0 &&
          prev.hours === 0 &&
          prev.mins === 0 &&
          prev.secs === 0
        ) {
          clearInterval(timer);
          return prev;
        }

        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        }

        if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        }

        if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            mins: 59,
            secs: 59,
          };
        }

        return {
          days: prev.days - 1,
          hours: 23,
          mins: 59,
          secs: 59,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: "Explore Tours",
      description:
        "Browse our tours and choose your perfect destination.",
      icon: (
        <>
          <circle cx="35" cy="31" r="16" />
          <path d="M47 43 L61 57" />
          <path d="M24 28 Q25 18 34 16" />
          <path d="M30 43 Q42 47 46 35" />
        </>
      ),
    },
    {
      title: "Book on WhatsApp",
      description:
        "Click the WhatsApp button and confirm your booking with us.",
      icon: (
        <>
          <rect x="20" y="10" width="37" height="52" rx="3" />
          <path d="M27 17 H48 M27 53 H40" />
          <circle cx="53" cy="34" r="15" fill="#70d72f" />
          <path
            d="M45 29 H60 M45 34 H60 M45 39 H56"
            stroke="white"
          />
        </>
      ),
    },
    {
      title: "Enjoy Your Trip",
      description:
        "Pack your bags and get ready for an unforgettable journey.",
      icon: (
        <>
          <rect x="12" y="29" width="45" height="22" rx="4" />
          <path d="M20 29 V21 H31 V29 M36 29 V21 H47 V29 M19 35 H27 V42 H19 Z M33 35 H41 V42 H33 Z M46 35 H52 V42 H46 Z" />
          <circle cx="23" cy="53" r="5" />
          <circle cx="48" cy="53" r="5" />
          <circle cx="65" cy="12" r="5" />
          <path d="M65 3 V1 M65 23 V21 M56 12 H54 M76 12 H74" />
        </>
      ),
    },
  ];

  const countdown = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.mins, label: "Mins" },
    { value: timeLeft.secs, label: "Secs" },
  ];

  const whatsappLink =
    "https://wa.me/919876543210?text=Hello%20Leela%20Tours!%20Please%20help%20me%20plan%20my%20trip.";

  const offerLink =
    "https://wa.me/919876543210?text=Hello%20Leela%20Tours!%20I%20want%20to%20claim%20the%20Early%20Bird%20Offer.";

  return (
    <section className="w-full overflow-hidden bg-white">
      {/* PLAN YOUR TRIP SECTION */}
      <div className="w-full bg-[#e5f4fc] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.65fr] lg:gap-12">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="font-caladea text-3xl font-bold leading-tight text-[#07569b] sm:text-4xl lg:text-[40px]">
              Plan Your Perfect Trip in 3 Simple Steps
            </h2>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book your trip on WhatsApp"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#60b260] px-5 py-3 text-base font-medium text-white transition hover:bg-green-700 sm:text-xl"
            >
              <img
                src={whatsappIcon}
                alt=""
                aria-hidden="true"
                className="h-7 w-7 shrink-0 object-contain"
              />
              Book on WhatsApp
            </a>
          </div>

          {/* Three Steps */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                {index < 2 && (
                  <div className="absolute left-[65%] top-[49px] hidden w-[85%] border-t-2 border-dashed border-[#07569b] sm:block" />
                )}

                <div className="relative z-10 flex h-[105px] w-[105px] items-center justify-center rounded-full border-2 border-[#8ba8dc] bg-white sm:h-[120px] sm:w-[120px]">
                  <svg
                    viewBox="0 0 80 70"
                    className="h-[75px] w-[75px] text-[#3266bd]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </svg>
                </div>

                <h3 className="mt-5 font-montserrat text-lg font-semibold text-[#3262b4] sm:text-base lg:text-[19px]">
                  {index + 1}. {step.title}
                </h3>

                <p className="mt-1 max-w-[220px] font-montserrat text-sm leading-snug text-gray-800">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FESTIVE EARLY BIRD OFFER */}
      <div className="mt-[60px] w-full px-5 pb-12 sm:px-8 lg:px-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 rounded-[28px] bg-gradient-to-r from-[#034579] via-[#164f8a] to-[#315fa5] px-6 py-10 text-white sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-16">
          {/* Offer Text */}
          <div>
            <p className="font-montserrat text-base font-medium sm:text-xl">
              Festive Early Bird Offer
            </p>

            <h2 className="mt-3 font-caladea text-3xl font-bold leading-tight sm:text-4xl lg:text-[40px]">
              Save up to{" "}
              <span className="text-[#ff7100]">₹4,000</span> on winter tours
            </h2>

            <p className="mt-3 max-w-[550px] font-montserrat text-sm leading-relaxed text-blue-200/80 sm:text-base">
              Book Any Kashmir, Ladakh Or Himachal Tour Before 31 October And
              Get Early Bird Prices Plus A Free Airport Pickup.
            </p>
          </div>

          {/* Countdown and CTA */}
          <div className="w-full">
            <div className="grid grid-cols-4 rounded-[20px] border-2 border-[#3975bd] bg-[#174477]/80 px-2 py-4 sm:px-4 sm:py-5">
              {countdown.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center justify-center ${
                    index !== 3
                      ? "border-r border-dashed border-sky-500/70"
                      : ""
                  }`}
                >
                  <span className="font-caladea text-3xl font-bold sm:text-4xl lg:text-[36px]">
                    {String(item.value).padStart(2, "0")}
                  </span>

                  <span className="font-caladea text-xl font-bold sm:text-2xl lg:text-[34px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={offerLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Claim the Early Bird Offer on WhatsApp"
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#ff7100] px-4 py-3 text-center font-montserrat text-base font-semibold text-white transition hover:bg-orange-600 sm:text-xl"
            >
              <img
                src={whatsappIcon}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 shrink-0 object-contain"
              />
              Claim My Early Bird Price
              <span className="text-2xl" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Steps;