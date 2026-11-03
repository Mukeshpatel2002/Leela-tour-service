import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import TripSection from "../components/home/TripSection";
import ReviewSection from "../components/home/ReviewSection";
import FaqSection from "../components/home/FaqSection";
import ReadyToBook from "../components/home/ReadyToBook";
import { getTourCategories, getContent } from "../api/api";
import groupBannerFallback from "../assets/group-hero-banner.png";
import banner1Image from "../assets/banner1.jpg";
import { FaChevronRight } from "react-icons/fa";

// Default curated category presets with friendly metadata
const DEFAULT_THEMED_CATEGORIES = [
  { name: "All", slug: "all", label: "All Themed Tours" },
  { name: "Sacred Journeys", slug: "sacred-journeys", label: "Sacred Journeys", icon: "worship" },
  { name: "Romantic Escapes", slug: "romantic-escapes", label: "Romantic Escapes", icon: "heart" },
  { name: "Heritage & Culture", slug: "heritage-and-culture", label: "Heritage & Culture", icon: "compass" },
  { name: "Mountains", slug: "mountains", label: "Mountains & Nature", icon: "mountain" },
];

const DEFAULT_GROUP_CATEGORIES = [
  { name: "All", slug: "all", label: "All Group Tours" },
  { name: "Friends & Family Trips", slug: "friends-and-family-trips", label: "Friends & Family", icon: "users" },
  { name: "School Group Tours", slug: "school-group-tours", label: "School Groups", icon: "grad" },
  { name: "Senior Group Tours", slug: "senior-group-tours", label: "Senior Tours", icon: "users" },
];

// Helper to normalize category name to slug
export const categoryToSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper to check slug match
export const isSlugMatch = (slug1, slug2) => {
  if (!slug1 && !slug2) return true;
  if (!slug1 || !slug2) return false;
  const s1 = slug1.toLowerCase().replace(/and/g, "").replace(/[^a-z0-9]/g, "");
  const s2 = slug2.toLowerCase().replace(/and/g, "").replace(/[^a-z0-9]/g, "");
  return s1 === s2;
};

export default function CategoriesPage() {
  const { type, categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Normalize tour type (themed | group) from param or pathname
  const isGroup =
    type?.toLowerCase() === "group" ||
    type?.toLowerCase() === "group-tour" ||
    location.pathname.toLowerCase().includes("group");
  const tourTypeParam = isGroup ? "Group Tour" : "Themed Tour";
  const tourTypeUrlKey = isGroup ? "group" : "themed";

  // Category state from URL (path slug or query param)
  const queryCat = searchParams.get("category");
  const rawCategoryIdentifier = categorySlug || queryCat || "all";

  // Dynamic categories loaded from backend
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getTourCategories();
        if (res.data?.success) {
          const catList = isGroup ? res.data.group : res.data.themed;
          if (Array.isArray(catList) && catList.length) {
            setDynamicCategories(catList);
          }
        }
      } catch (err) {
        // Fallback silently to default presets
      }
    };

    const fetchContentData = async () => {
      try {
        const res = await getContent();
        if (res.data?.success && res.data.content) {
          setSiteContent(res.data.content);
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchCats();
    fetchContentData();
  }, [isGroup]);

  // Combine defaults with dynamic categories from DB
  const categoriesList = useMemo(() => {
    const defaults = isGroup ? DEFAULT_GROUP_CATEGORIES : DEFAULT_THEMED_CATEGORIES;
    const combined = [...defaults];

    // Add any unique category from DB that isn't already in defaults
    dynamicCategories.forEach((catName) => {
      if (!catName || catName.trim() === "") return;
      const slug = categoryToSlug(catClean(catName));
      const exists = combined.some(
        (c) => c.slug === slug || isSlugMatch(c.slug, slug) || c.name.toLowerCase() === catName.toLowerCase()
      );
      if (!exists) {
        combined.push({
          name: catName,
          slug,
          label: catName,
          icon: "compass",
        });
      }
    });

    return combined;
  }, [isGroup, dynamicCategories]);

  // Helper clean string
  function catClean(str) {
    return (str || "").trim();
  }

  // Find active category item
  const activeCategoryItem = useMemo(() => {
    if (!rawCategoryIdentifier || rawCategoryIdentifier === "all") {
      return categoriesList[0];
    }
    const matched = categoriesList.find(
      (c) =>
        c.slug === rawCategoryIdentifier ||
        isSlugMatch(c.slug, rawCategoryIdentifier) ||
        c.name.toLowerCase() === rawCategoryIdentifier.toLowerCase().replace(/-/g, " ")
    );
    if (matched) return matched;

    // Custom non-preset category
    const cleanName = rawCategoryIdentifier.replace(/-/g, " ");
    return {
      name: cleanName,
      slug: rawCategoryIdentifier,
      label: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    };
  }, [rawCategoryIdentifier, categoriesList]);

  const activeCategoryName = activeCategoryItem?.slug === "all" ? null : activeCategoryItem?.name;

  const handleSelectCategory = (slug) => {
    if (slug === "all") {
      navigate(`/categories/${tourTypeUrlKey}`);
    } else {
      navigate(`/categories/${tourTypeUrlKey}/${slug}`);
    }
  };

  // Current Hero configuration from DB or fallbacks
  const currentHeroData = isGroup ? siteContent?.groupHero : siteContent?.themedHero;

  // Background image: custom image from admin OR local uploaded banner fallback OR unsplash
  const heroImage = currentHeroData?.image?.trim()
    ? currentHeroData.image
    : isGroup
    ? groupBannerFallback
    : banner1Image;

  // Hero titles & subtitles & badge
  const defaultTitle = isGroup ? "Group Tours" : "Themed Tours";
  const defaultSubtitle = isGroup
    ? "Fixed departures, verified itineraries, friendly small groups and memories for a lifetime."
    : "Handpicked journeys planned around who you travel with — romance, culture, adventure and spirituality.";
  const defaultBadge = isGroup ? "Small Group Departures" : "Curated Themed Experiences";

  const heroTitle = activeCategoryName || currentHeroData?.title || defaultTitle;
  const heroSubtitle = activeCategoryName
    ? `Explore our handpicked ${activeCategoryName} packages with verified stays, seamless logistics and transparent pricing.`
    : currentHeroData?.subtitle || defaultSubtitle;
  const heroBadge = currentHeroData?.badge || defaultBadge;

  // 4 Statistics items (Matching image design: 500+ Happy Group Travellers | 50+ Group Trips | 20+ Destinations | 10+ Years of Experience)
  const defaultStats = isGroup
    ? [
        { number: "500+", label: "Happy Group Travellers" },
        { number: "50+", label: "Group Trips" },
        { number: "20+", label: "Destinations" },
        { number: "10+", label: "Years of Experience" },
      ]
    : [
        { number: "1,200+", label: "Happy Explorers" },
        { number: "35+", label: "Curated Itineraries" },
        { number: "15+", label: "Unique Themes" },
        { number: "10+", label: "Years of Trust" },
      ];

  const heroStats =
    currentHeroData?.stats && currentHeroData.stats.length === 4
      ? currentHeroData.stats
      : defaultStats;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION / BANNER (Image-based with Dark Overlay & Floating Stats Pill) */}
        <section className="relative w-full">
          {/* Panoramic Hero Banner with Image */}
          <div
            className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] w-full bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center pb-16 pt-10"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            {/* Subtle Gradient Overlay for Crisp Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35" />

            <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 text-center">
              {/* Breadcrumb */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs sm:text-sm font-montserrat text-white backdrop-blur-md border border-white/25 shadow">
                <Link to="/" className="hover:text-blue-200 transition">
                  Home
                </Link>
                <FaChevronRight className="text-[10px] opacity-70" />
                <Link to={`/categories/${tourTypeUrlKey}`} className="hover:text-blue-200 transition">
                  {isGroup ? "Group Tours" : "Themed Tours"}
                </Link>
                {activeCategoryName && (
                  <>
                    <FaChevronRight className="text-[10px] opacity-70" />
                    <span className="font-semibold text-white">{activeCategoryName}</span>
                  </>
                )}
              </div>

              {/* Badge */}
              <div>
                <span className="inline-block rounded-full bg-[#ff6500] px-4 py-1 text-xs font-montserrat font-bold tracking-wider uppercase text-white shadow-lg">
                  {heroBadge}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="mt-4 font-caladea text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                {heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-4 max-w-2xl font-montserrat text-base sm:text-lg leading-relaxed text-blue-50 drop-shadow">
                {heroSubtitle}
              </p>
            </div>
          </div>

          {/* FLOATING STATS PILL - Exactly Matching User's Uploaded Mockup */}
          <div className="relative z-20 mx-auto -mt-10 sm:-mt-12 md:-mt-14 w-[92%] max-w-[1240px] rounded-[22px] sm:rounded-[28px] border border-sky-300/80 bg-white px-4 py-4 sm:py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center">
              {heroStats.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center px-3 sm:px-6 py-2 text-center ${
                    idx < heroStats.length - 1 ? "md:border-r border-sky-400" : ""
                  } ${idx < 2 ? "border-b border-sky-300/40 md:border-b-0" : ""}`}
                >
                  <span className="font-montserrat text-[26px] sm:text-[34px] font-extrabold leading-none text-[#ff6500]">
                    {item.number}
                  </span>
                  <span className="mt-2 font-montserrat text-[13px] sm:text-[15px] font-semibold text-[#07569b]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRIPS SECTION */}
        <TripSection
          tourType={tourTypeParam}
          category={activeCategoryName || undefined}
          title={activeCategoryName ? `${activeCategoryName} Tours` : `All ${tourTypeParam}s`}
          subtitle={activeCategoryName ? `Curated Packages` : `Upcoming Departures`}
          description={
            activeCategoryName
              ? `Check out the upcoming departures for ${activeCategoryName}. Real-time seat availability with easy WhatsApp confirmation.`
              : `Handpicked departures with verified hotels, experienced local guides and complete peace of mind.`
          }
          emptyMessage={
            activeCategoryName
              ? `No tours currently active under "${activeCategoryName}".`
              : `No ${tourTypeParam}s available right now.`
          }
        />

        {/* 1. CUSTOMER TESTIMONIALS (Loved by 500+ travellers) */}
        <ReviewSection />

        {/* 2. FAQS (Questions? We've got answers) */}
        <FaqSection />

        {/* 3. READY TO BOOK CTA */}
        <ReadyToBook />
      </main>

      <Footer />
    </div>
  );
}
