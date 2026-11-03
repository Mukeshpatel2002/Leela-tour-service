import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaTimes } from "react-icons/fa";

export default function TourHighlightsVideo({ tour }) {
  if (!tour) return null;

  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = tour.videoUrl || "https://www.youtube.com/embed/fD3Xj02nL3w";
  const thumbnail =
    tour.videoThumbnail ||
    tour.image ||
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80";

  return (
    <section className="w-full bg-[#fdf9f4] py-14 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1100px] text-center">
        {/* Section Heading matching Image 5 */}
        <p className="font-montserrat text-sm sm:text-base font-bold uppercase tracking-wider text-[#ff6500]">
          {tour.videoSubtitle || "REAL TRIPS. REAL MEMORIES."}
        </p>

        <h2 className="mt-2 font-caladea text-3xl sm:text-4xl md:text-5xl font-bold text-[#07569b]">
          {tour.videoTitle || `Our ${tour.title?.replace("Magical ", "") || "Kashmir"} Trip Highlights`}
        </h2>

        {/* Video Card Container */}
        <div className="relative mt-8 mx-auto aspect-video max-w-[950px] overflow-hidden rounded-[28px] shadow-2xl border-4 border-white group">
          {!isPlaying ? (
            <div
              className="relative h-full w-full bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${thumbnail})` }}
              onClick={() => setIsPlaying(true)}
            >
              {/* Dark subtle overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

              {/* Red YouTube-style Play Button matching Image 5 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Play video"
                  className="flex h-20 w-28 sm:h-24 sm:w-36 items-center justify-center rounded-3xl bg-[#f53d2d] text-white shadow-2xl transition duration-300 group-hover:scale-110 cursor-pointer"
                >
                  <FaPlay className="text-3xl sm:text-4xl ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full bg-black">
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                title="Close Video"
              >
                <FaTimes />
              </button>
              <iframe
                src={`${videoUrl}?autoplay=1`}
                title="Trip Video Highlights"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Explore Upcoming Tours Big Orange Button matching Image 5 */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/#trips-section"
            className="inline-flex items-center justify-center rounded-2xl sm:rounded-full bg-[#ff6500] hover:bg-[#e65500] px-10 sm:px-14 py-4 font-montserrat text-xl sm:text-2xl font-bold text-white shadow-xl transition duration-200 transform hover:-translate-y-1"
          >
            Explore Upcoming Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
