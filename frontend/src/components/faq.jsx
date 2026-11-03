// import React from 'react'
// import "./home.css";

// export default function faq() {
//   return (
//     <div>
//       <h2 className="mk">faq</h2>
//     </div>
//   )
// }



import { useState } from "react";
import whatsappIcon from "../assets/whatsapp.png";

const faqItems = [
  {
    question: "How can I Book a Tour?",
    answer:
      "Booking is simple! Explore our tours, choose your preferred destination and contact Leela Tours on WhatsApp. Our travel team will help you with dates, availability, pricing and the booking process.",
  },
  {
    question: "What is included in the tour package?",
    answer:
      "Inclusions depend on the package. They may include hotel stays, sightseeing, transfers and selected meals. We will share the complete itinerary and inclusions before you confirm your booking.",
  },
  {
    question: "Can I customize my tour package?",
    answer:
      "Yes! You can discuss your preferred destinations, travel dates, group size and budget with our team. We will help you explore a suitable travel plan based on availability.",
  },
  {
    question: "How can I make a payment?",
    answer:
      "Please contact our team for the current payment process and booking terms. We will explain the payment schedule and any applicable cancellation conditions before you confirm.",
  },
  {
    question: "What if I need to cancel or change my trip?",
    answer:
      "Contact us as soon as possible on WhatsApp. Changes and cancellations depend on the package terms, hotel and transport policies, and how close you are to your departure date.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const whatsappLink =
    "https://wa.me/919876543210?text=Hello%20Leela%20Tours%2C%20I%20have%20a%20question%20about%20your%20tours.";

  return (
    <section className="w-full bg-[#fff4eb] py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-10">
        {/* Left Side */}
        <div className="flex flex-col">
          <p className="font-montserrat text-2xl font-medium uppercase text-orange-500 sm:text-[34px]">
            FAQs
          </p>

          <h2 className="mt-3 font-caladea text-5xl font-bold leading-[1.02] text-[#07569b] sm:text-6xl lg:text-[68px]">
            Questions? We've
            <br />
            <span className="text-orange-500">got answers</span>
          </h2>

          <p className="mt-6 max-w-[540px] font-montserrat text-lg leading-relaxed text-[#85817e] sm:text-2xl">
            Everything you need to know before you book. Still unsure? Just ask
            us.
          </p>

          {/* WhatsApp Card */}
          <div className="mt-6 flex min-h-[210px] max-w-[595px] flex-col justify-center rounded-[30px] bg-gradient-to-r from-[#034578] to-[#315fa5] p-7 sm:p-9">
            <h3 className="font-caladea text-3xl font-bold text-white sm:text-4xl">
              Still have a question?
            </h3>

            <p className="mt-1 max-w-[370px] font-montserrat text-sm leading-relaxed text-blue-200 sm:text-base">
              Our travel experts reply on WhatsApp within 10 minutes, 9am to
              9pm.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask Leela Tours on WhatsApp"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#08a900] px-5 py-3 font-montserrat text-lg font-semibold text-white transition hover:bg-green-700 sm:text-2xl"
            >
              <img
                src={whatsappIcon}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 shrink-0 object-contain"
              />

              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* Right Side: FAQ Accordion */}
        <div className="flex flex-col gap-4 lg:pt-6">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-[18px] border-2 bg-white transition-colors ${
                  isOpen ? "border-orange-400" : "border-orange-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                >
                  <span className="font-montserrat text-lg font-semibold text-black sm:text-2xl">
                    {item.question}
                  </span>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0d6] text-xl font-bold text-orange-500">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 font-montserrat text-sm leading-7 text-gray-600 sm:px-6 sm:text-base">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

