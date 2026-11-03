// import React from 'react'

// export default function review() {
//   return (
//     <div>
//       <h2>Review section</h2>
//     </div>
//   )
// }


import { useRef } from "react";
import travelerImage from "../assets/traveler1.png";

const reviews = [
  {
    id: 1,
    name: "Rahul Patil",
    tour: "Magical Kashmir",
    review:
      "Everything was sorted from the first WhatsApp message. Hotels were better than we expected and our tour manager knew every good place to eat. My parents still talk about Gulmarg.",
  },
  {
    id: 2,
    name: "Sneha Kulkarni",
    tour: "Kerala Honeymoon",
    review:
      "We wanted a relaxed honeymoon and that is exactly what we got. The houseboat night was magical. Leela Tours even arranged a cake on our last day without us asking.",
  },
  {
    id: 3,
    name: "Suresh Sharma",
    tour: "Senior Tour",
    review:
      "At 68 I was worried about the pace. The trip was easy, the hotels were comfortable and the places were very well planned. I would happily travel with them again.",
  },
  {
    id: 4,
    name: "Priya Verma",
    tour: "Family Holiday",
    review:
      "Our family trip was wonderful. The itinerary was well planned, the hotels were clean and every detail was handled smoothly. We made memories we will never forget.",
  },
  {
    id: 5,
    name: "Amit Singh",
    tour: "Rajasthan Tour",
    review:
      "The destinations, local guides and hotel arrangements were excellent. The team was always available on WhatsApp whenever we needed help during the trip.",
  },
  {
    id: 6,
    name: "Neha Mehta",
    tour: "Himachal Tour",
    review:
      "Beautiful mountain views and a stress-free holiday. Everything was arranged in advance and our family really enjoyed the entire experience.",
  },
];

function Review() {
  const scrollRef = useRef(null);

  const scrollReviews = (direction) => {
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
        <div className="mb-8 text-center">
          <p className="font-montserrat text-lg font-semibold uppercase tracking-wide text-orange-500 sm:text-xl">
            Customer Testimonials
          </p>

          <h2 className="mt-2 font-caladea text-4xl font-bold leading-tight text-[#07569b] sm:text-5xl md:text-[64px]">
            Loved by <span className="text-orange-500">500+ travellers</span>
          </h2>

          <p className="mt-2 font-montserrat text-base text-gray-500 sm:text-xl">
            Real words from families, couples and seniors who travelled with us.
          </p>
        </div>

        {/* Scroll buttons */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollReviews(-1)}
            aria-label="Previous reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white"
          >
            &#8592;
          </button>

          <button
            type="button"
            onClick={() => scrollReviews(1)}
            aria-label="Next reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white"
          >
            &#8594;
          </button>
        </div>

        {/* Review cards */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-4 sm:gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((item) => (
            <article
              key={item.id}
              className="flex min-h-[340px] flex-[0_0_100%] snap-start flex-col rounded-[22px] bg-white p-6 shadow-[0_2px_18px_rgba(0,0,0,0.17)] sm:flex-[0_0_calc(50%-12px)] lg:min-h-[385px] lg:flex-[0_0_calc(33.333%-16px)] lg:p-7"
            >
              {/* Stars */}
              <div
                className="mb-4 font-montserrat text-2xl tracking-wide text-amber-400"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </div>

              {/* Review text */}
              <p className="font-montserrat text-base leading-7 text-gray-900 sm:text-lg">
                {item.review}
              </p>

              {/* Reviewer */}
              <div className="mt-auto flex items-center gap-4 pt-7">
                <img
                  src={travelerImage}
                  alt={`${item.name} reviewer`}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-montserrat text-base font-bold text-black sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="font-montserrat text-sm text-gray-600 sm:text-base">
                    {item.tour}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Review;

