import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { getTours, submitPublicReview } from "../api/api";
import { toast } from "react-hot-toast";
import { FaStar, FaCamera, FaTimes, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function SubmitReviewPage() {
  const [searchParams] = useSearchParams();
  const preselectedTour = searchParams.get("tour") || "";

  const [tours, setTours] = useState([]);
  const [tourName, setTourName] = useState(preselectedTour || "Magical Kashmir");
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadTours = async () => {
      try {
        const res = await getTours();
        if (res.data?.success && res.data.tours?.length) {
          setTours(res.data.tours);
          if (!preselectedTour) {
            setTourName(res.data.tours[0].title);
          }
        }
      } catch (err) {
        // Fallback
      }
    };

    loadTours();
  }, [preselectedTour]);

  // Client-side auto compression for high-res mobile camera photos
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Photo size should be less than 25MB");
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      setPhoto(compressedBase64);
      toast.success("Photo attached & optimized for fast upload!");
    } catch (err) {
      toast.error("Failed to process photo. Please try another image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a few words about your experience");
      return;
    }

    setLoading(true);

    try {
      const res = await submitPublicReview({
        name: name.trim(),
        tour: tourName,
        rating,
        review: review.trim(),
        photo,
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
      });

      if (res.data?.success) {
        setSubmitted(true);
        toast.success("Thank you! Review submitted successfully.");
      } else {
        toast.error(res.data?.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: "1 Star - Needs Improvement",
    2: "2 Stars - Fair Experience",
    3: "3 Stars - Good Trip",
    4: "4 Stars - Great Experience",
    5: "5 Stars - Outstanding & Memorable!",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf9f4]">
      <Header />

      <main className="flex-1 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-montserrat text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#07569b] transition"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Form Container or Success Screen */}
          {submitted ? (
            <div className="rounded-3xl border border-green-100 bg-white p-8 sm:p-12 text-center shadow-xl">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 text-4xl mb-5">
                <FaCheckCircle />
              </div>

              <h1 className="font-caladea text-3xl sm:text-4xl font-bold text-[#07569b]">
                Thank You for Your Review!
              </h1>

              <p className="mt-3 font-montserrat text-sm sm:text-base leading-relaxed text-gray-600 max-w-md mx-auto">
                Your feedback for <strong>{tourName}</strong> has been received with thanks! Our team will verify and publish your review on the tour page shortly.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/"
                  className="w-full sm:w-auto rounded-full bg-[#07569b] hover:bg-[#064780] px-8 py-3.5 font-montserrat text-sm font-bold text-white shadow transition"
                >
                  Explore More Tours
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setReview("");
                    setPhoto("");
                  }}
                  className="w-full sm:w-auto rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-8 py-3.5 font-montserrat text-sm font-semibold text-gray-700 transition"
                >
                  Submit Another Review
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-10 shadow-xl">
              {/* Header */}
              <div className="text-center pb-6 border-b border-gray-100">
                <p className="font-montserrat text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ff6500]">
                  TOURIST FEEDBACK
                </p>
                <h1 className="mt-1.5 font-caladea text-3xl sm:text-4xl font-bold text-[#07569b]">
                  Share Your Tour Experience
                </h1>
                <p className="mt-2 font-montserrat text-xs sm:text-sm text-gray-500">
                  Completed your trip with Leela Tours? Help fellow travellers by sharing your honest feedback and vacation photos.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6 font-montserrat">
                {/* 1. Trip Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Which Tour Did You Complete? *
                  </label>
                  <select
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3.5 text-sm font-semibold text-gray-800 outline-none focus:border-[#07569b] focus:ring-1 focus:ring-[#07569b]"
                  >
                    {tours.length > 0 ? (
                      tours.map((t) => (
                        <option key={t._id} value={t.title}>
                          {t.title} ({t.duration})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Magical Kashmir">Magical Kashmir (6D/5N)</option>
                        <option value="Kerala Backwaters & Hills">Kerala Backwaters & Hills (6D/5N)</option>
                        <option value="Royal Rajasthan Heritage">Royal Rajasthan Heritage (7D/6N)</option>
                        <option value="Himachal Mountain Bliss">Himachal Mountain Bliss (6D/5N)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 2. Rating Star Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl sm:text-3xl text-gray-300 transition-colors p-1 cursor-pointer focus:outline-none"
                        style={{
                          color: (hoverRating || rating) >= star ? "#f59e0b" : "#d1d5db",
                        }}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="ml-2 font-semibold text-xs sm:text-sm text-gray-700">
                      {ratingLabels[rating]}
                    </span>
                  </div>
                </div>

                {/* 3. Name & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      className="h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-[#07569b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      WhatsApp / Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-11 w-full rounded-xl border border-gray-300 px-3.5 text-sm outline-none focus:border-[#07569b]"
                    />
                  </div>
                </div>

                {/* 4. Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Experience & Review *
                  </label>
                  <textarea
                    rows="4"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    placeholder="Tell us about the hotel stay, tour manager, sightseeing, vehicles, food, and what made your journey special..."
                    className="w-full rounded-xl border border-gray-300 p-3.5 text-sm outline-none focus:border-[#07569b]"
                  />
                </div>

                {/* 5. Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Upload Your Vacation Photo (optional)
                  </label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Share a photo of yourself on the trip or a scenic view you loved.
                  </p>

                  {photo ? (
                    <div className="relative inline-block">
                      <img
                        src={photo}
                        alt="Uploaded preview"
                        className="h-28 w-28 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setPhoto("")}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 cursor-pointer text-xs"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/70 hover:border-[#ff6500] hover:bg-orange-50/30 transition">
                      <FaCamera className="text-2xl text-gray-400 mb-1" />
                      <span className="text-xs font-semibold text-gray-600">
                        Click to select photo from device
                      </span>
                      <span className="text-[10px] text-gray-400">Mobile camera & high-res photos supported (up to 25MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#ff6500] hover:bg-[#e65500] py-4 text-center font-montserrat text-base font-bold text-white shadow-lg transition duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Submitting Review..." : "Submit My Review"}
                  </button>
                  <p className="mt-2 text-center text-[11px] text-gray-400">
                    Your review will be verified by the admin team before appearing publicly.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
