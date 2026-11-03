import React, { useState } from "react";
import { FaTimes, FaExpand } from "react-icons/fa";

export default function TourGallery({ tour }) {
  const [lightboxImg, setLightboxImg] = useState(null);

  // Default scenic gallery matching design image 1
  const defaultGallery = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
  ];

  // Use tour gallery images if available, otherwise use defaults
  const galleryImages =
    tour?.gallery && tour.gallery.length > 0
      ? tour.gallery
      : defaultGallery;

  if (!tour) return null;

  return (
    <section className="w-full bg-[#eaf6fd] py-14 sm:py-18 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Heading matching Image 1 */}
        <div className="mb-10 text-center">
          <p className="font-montserrat text-sm sm:text-base font-bold uppercase tracking-wider text-[#ff6500]">
            OUR TRAVEL GALLERY
          </p>
          <h2 className="mt-2 font-caladea text-3xl sm:text-4xl md:text-5xl font-bold text-[#07569b]">
            Moments Worth Remembering
          </h2>
        </div>

        {/* 3-Column Layout matching Image 1 exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Column 1: 1 Tall Vertical Image */}
          <div
            className="group relative overflow-hidden rounded-[24px] bg-gray-200 shadow-sm cursor-pointer min-h-[320px] md:min-h-[440px]"
            onClick={() => setLightboxImg(galleryImages[0])}
          >
            <img
              src={galleryImages[0]}
              alt="Travel Moment 1"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
              <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-2xl" />
            </div>
          </div>

          {/* Column 2: 2 Stacked Images */}
          <div className="flex flex-col gap-4 md:gap-5 justify-between">
            <div
              className="group relative overflow-hidden rounded-[24px] bg-gray-200 shadow-sm cursor-pointer h-[200px] md:h-[210px]"
              onClick={() => setLightboxImg(galleryImages[1] || galleryImages[0])}
            >
              <img
                src={galleryImages[1] || galleryImages[0]}
                alt="Travel Moment 2"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-xl" />
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-[24px] bg-gray-200 shadow-sm cursor-pointer h-[200px] md:h-[210px]"
              onClick={() => setLightboxImg(galleryImages[2] || galleryImages[0])}
            >
              <img
                src={galleryImages[2] || galleryImages[0]}
                alt="Travel Moment 3"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-xl" />
              </div>
            </div>
          </div>

          {/* Column 3: 2 Stacked Images */}
          <div className="flex flex-col gap-4 md:gap-5 justify-between">
            <div
              className="group relative overflow-hidden rounded-[24px] bg-gray-200 shadow-sm cursor-pointer h-[200px] md:h-[210px]"
              onClick={() => setLightboxImg(galleryImages[3] || galleryImages[0])}
            >
              <img
                src={galleryImages[3] || galleryImages[0]}
                alt="Travel Moment 4"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-xl" />
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-[24px] bg-gray-200 shadow-sm cursor-pointer h-[200px] md:h-[210px]"
              onClick={() => setLightboxImg(galleryImages[4] || galleryImages[0])}
            >
              <img
                src={galleryImages[4] || galleryImages[0]}
                alt="Travel Moment 5"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Images Row (if tour has more than 5 images) */}
        {galleryImages.length > 5 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.slice(5).map((img, i) => (
              <div
                key={i + 5}
                className="group relative overflow-hidden rounded-[20px] bg-gray-200 shadow-sm cursor-pointer h-[160px]"
                onClick={() => setLightboxImg(img)}
              >
                <img
                  src={img}
                  alt={`Travel Moment ${i + 6}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-center justify-center">
                  <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition text-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-center font-montserrat text-xs text-gray-500">
          Click any photo to view full size
        </p>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <FaTimes className="text-xl" />
          </button>
          <img
            src={lightboxImg}
            alt="Full size view"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
