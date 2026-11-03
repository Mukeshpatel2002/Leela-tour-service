import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTourById } from "../api/api";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import TourHeroBanner from "../components/tour-details/TourHeroBanner";
import TourOverview from "../components/tour-details/TourOverview";
import TourBookingCard from "../components/tour-details/TourBookingCard";
import TourItinerary from "../components/tour-details/TourItinerary";
import TourInclusions from "../components/tour-details/TourInclusions";
import TourHighlightsVideo from "../components/tour-details/TourHighlightsVideo";
import TourGallery from "../components/tour-details/TourGallery";
import TourTestimonials from "../components/tour-details/TourTestimonials";
import TourCTA from "../components/tour-details/TourCTA";

export default function TourDetailsPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await getTourById(id);
        if (res.data?.success) {
          setTour(res.data.tour);
        } else {
          setError("Tour details not found.");
        }
      } catch (err) {
        setError("Unable to load tour details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
            <p className="font-montserrat text-sm text-gray-600">Loading Tour Experience...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="font-caladea text-3xl font-bold text-gray-800">Tour Not Found</h2>
          <p className="mt-2 font-montserrat text-gray-500">
            The tour you are looking for does not exist or has been updated.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-full bg-[#078bd3] px-6 py-2.5 font-montserrat text-sm font-semibold text-white shadow hover:bg-blue-600 transition"
          >
            ← Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf5]">
      {/* Global Navigation Header */}
      <Header />

      <main className="flex-1">
        {/* SECTION 1 (Image 1): Hero Scenic Landscape with Floating Pricing Card */}
        <TourHeroBanner tour={tour} />

        {/* SECTION 2 (Image 2): Journey Highlights (Left) & Sticky Booking Widget (Right) */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-start">
            {/* Left: 6 Highlight Cards */}
            <TourOverview tour={tour} />

            {/* Right: Sticky Booking Calculator Card */}
            <div className="flex justify-center lg:justify-end">
              <TourBookingCard tour={tour} />
            </div>
          </div>
        </section>

        {/* SECTION 3 (Image 3): Day-by-Day Itinerary Accordions */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-6">
          <TourItinerary tour={tour} />
        </section>

        {/* SECTION 4 (Image 4): Inclusions & Exclusions Comparison Cards */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-6">
          <TourInclusions tour={tour} />
        </section>

        {/* SECTION 5 (Image 5): Highlights Video & Explore Upcoming Tours CTA */}
        <TourHighlightsVideo tour={tour} />

        {/* SECTION 6: Our Travel Gallery (Moments Worth Remembering) */}
        <TourGallery tour={tour} />

        {/* SECTION 7: Testimonials (What travellers say) */}
        <TourTestimonials tour={tour} />

        {/* SECTION 8: Call to Action (Destination is calling. Shall we?) */}
        <TourCTA tour={tour} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
