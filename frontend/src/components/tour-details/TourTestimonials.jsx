import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getReviews } from "../../api/api";
import traveler1 from "../../assets/traveler1.png";
import traveler2 from "../../assets/traveler2.png";
import traveler3 from "../../assets/traveler3.png";
import { FaChevronLeft, FaChevronRight, FaStar, FaPen } from "react-icons/fa";

export default function TourTestimonials({ tour }) {
  const scrollRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const avatars = [traveler1, traveler2, traveler3];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviews();
        if (res.data?.success && res.data.reviews?.length) {
          // If tour matches, show matching, otherwise show top reviews
          const matched = res.data.reviews.filter(
            (r) =>
              r.tour &&
              tour?.title &&
              r.tour.toLowerCase().includes(tour.title.toLowerCase().slice(0, 7))
          );
          setReviews(matched.length > 0 ? matched : res.data.reviews);
        } else {
          // Fallback defaults matching design image
          setReviews([
            {
              name: "Rahul Patil",
              tour: tour?.title || "Magical Kashmir",
              rating: 5,
              review:
                "Our Kashmir Trip Was An Amazing Experience! From The Beautiful Dal Lake To The Breathtaking Valleys Of Gulmarg And Pahalgam, Every Moment Was Special. The Entire Journey Was Smooth And Memorable.",
            },
            {
              name: "Sneha Kulkarni",
              tour: tour?.title || "Magical Kashmir",
              rating: 5,
              review:
                "Everything Was Well Planned, And We Enjoyed Every Destination Along The Way. The Scenic Views, Comfortable Stay, And Wonderful Experiences Made Our Kashmir Holiday Truly Unforgettable.",
            },
            {
              name: "Suresh More",
              tour: tour?.title || "Magical Kashmir",
              rating: 5,
              review:
                "Kashmir Was More Magical Than We Imagined. We Loved The Houseboat Stay, Enjoying The Shikara Ride, And Every Special Moment. A Perfectly Arranged Trip To Cherish Forever.",
            },
          ]);
        }
      } catch (err) {
        // Fallback default
        setReviews([
          {
            name: "Rahul Patil",
            tour: tour?.title || "Magical Kashmir",
            rating: 5,
            review:
              "Our Kashmir Trip Was An Amazing Experience! From The Beautiful Dal Lake To The Breathtaking Valleys Of Gulmarg And Pahalgam, Every Moment Was Special. The Entire Journey Was Smooth And Memorable.",
          },
          {
            name: "Sneha Kulkarni",
            tour: tour?.title || "Magical Kashmir",
            rating: 5,
            review:
              "Everything Was Well Planned, And We Enjoyed Every Destination Along The Way. The Scenic Views, Comfortable Stay, And Wonderful Experiences Made Our Kashmir Holiday Truly Unforgettable.",
          },
          {
            name: "Suresh More",
            tour: tour?.title || "Magical Kashmir",
            rating: 5,
            review:
              "Kashmir Was More Magical Than We Imagined. We Loved The Houseboat Stay, Enjoying The Shikara Ride, And Every Special Moment. A Perfectly Arranged Trip To Cherish Forever.",
          },
        ]);
      }
    };

    fetchReviews();
  }, [tour]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 360,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="tour-reviews" className="w-full bg-white py-14 sm:py-18 px-5 sm:px-8 lg:px-12 scroll-mt-24">
      <div className="mx-auto max-w-[1300px]">
        {/* Section Heading matching Image 2 */}
        <div className="mb-10 text-center">
          <p className="font-montserrat text-sm sm:text-base font-bold uppercase tracking-wider text-[#ff6500]">
            TESTIMONIAL
          </p>
          <h2 className="mt-2 font-caladea text-3xl sm:text-4xl md:text-5xl font-bold text-[#07569b]">
            What travellers say
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-[#07569b] hover:text-white transition cursor-pointer"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next reviews"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-[#07569b] hover:text-white transition cursor-pointer"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>

        {/* Testimonial Cards matching Image 2 design */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex min-w-[300px] sm:min-w-[360px] max-w-[380px] flex-col justify-between rounded-[24px] border border-gray-100 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              {/* Star Rating */}
              <div>
                <div className="mb-4 flex gap-1 text-amber-400 text-base">
                  {"★".repeat(item.rating || 5)}
                </div>

                {/* Review Text */}
                <p className="font-montserrat text-sm leading-relaxed text-gray-700">
                  {item.review}
                </p>
              </div>

              {/* Author Details with avatar/photo */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-gray-100 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#078bd3] text-white font-bold text-sm overflow-hidden border border-orange-200">
                  <img
                    src={item.photo || avatars[idx % avatars.length]}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = avatars[idx % avatars.length];
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-montserrat text-sm font-bold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="font-montserrat text-xs text-gray-500 truncate">
                    {item.tour || tour?.title || "Tour Traveler"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Give Your Review CTA Banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#fff7ed] p-6 sm:p-7 border border-orange-200 shadow-xs">
          <div>
            <h4 className="font-caladea text-xl sm:text-2xl font-bold text-[#07569b]">
              Travelled with us on this tour?
            </h4>
            <p className="font-montserrat text-xs sm:text-sm text-gray-600 mt-1">
              Share your photos and feedback to help fellow travellers plan their journey.
            </p>
          </div>

          <Link
            to={`/submit-review?tour=${encodeURIComponent(tour?.title || "Magical Kashmir")}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#ff6500] hover:bg-[#e65500] px-7 py-3.5 font-montserrat text-sm font-bold text-white shadow-md transition transform hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <FaPen className="text-xs" />
            <span>Give Your Review</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
