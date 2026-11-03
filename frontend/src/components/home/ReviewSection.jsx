import React, { useRef, useState, useEffect } from "react";
import { getReviews } from "../../api/api";
import traveler1 from "../../assets/traveler1.png";
import traveler2 from "../../assets/traveler2.png";
import traveler3 from "../../assets/traveler3.png";

export default function ReviewSection() {
  const scrollRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const travelerAvatars = [traveler1, traveler2, traveler3];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviews();
        if (res.data?.success && res.data.reviews?.length) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        // Fallback reviews
      }
    };
    fetchReviews();
  }, []);

  const scrollReviews = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * scrollRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full overflow-hidden bg-white py-14 sm:py-18">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="font-montserrat text-lg font-semibold uppercase tracking-wide text-[#ff6500] sm:text-xl">
            Customer Testimonials
          </p>

          <h2 className="mt-2 font-caladea text-4xl font-bold leading-tight text-[#07569b] sm:text-5xl md:text-[56px]">
            Loved by <span className="text-[#ff6500]">500+ travellers</span>
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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white cursor-pointer"
          >
            &#8592;
          </button>

          <button
            type="button"
            onClick={() => scrollReviews(1)}
            aria-label="Next reviews"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-800 text-xl text-[#07569b] transition hover:bg-[#07569b] hover:text-white cursor-pointer"
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
          {reviews.map((item, index) => (
            <article
              key={item._id || index}
              className="flex min-h-[320px] flex-[0_0_100%] snap-start flex-col rounded-[22px] bg-white p-6 shadow-[0_2px_18px_rgba(0,0,0,0.12)] border border-gray-100 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] lg:p-7"
            >
              {/* Stars */}
              <div
                className="mb-3 font-montserrat text-xl tracking-wider text-amber-400"
                aria-label={`${Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5)))} out of 5 stars`}
              >
                {"★".repeat(Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5))))}
              </div>

              {/* Review text */}
              <p className="font-montserrat text-[15px] leading-relaxed text-gray-700">
                "{item.review}"
              </p>

              {/* Reviewer */}
              <div className="mt-auto flex items-center gap-3.5 pt-6 border-t border-gray-100">
                <img
                  src={item.photo || travelerAvatars[index % travelerAvatars.length]}
                  alt={`${item.name} reviewer`}
                  className="h-18 w-18 shrink-0 rounded-full object-cover border-2 border-orange-200"
                  onError={(e) => {
                    e.target.src = travelerAvatars[index % travelerAvatars.length];
                  }}
                />

                <div>
                  <h3 className="font-montserrat text-base font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="font-montserrat text-xs font-semibold text-[#ff6500]">
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
