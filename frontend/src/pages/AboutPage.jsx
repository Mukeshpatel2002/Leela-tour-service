import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import useContact from "../hooks/useContact";
import { getContent, getReviews } from "../api/api";
import bannerImage from "../assets/banner1.jpg";
import tripImage from "../assets/trip.jpg";
import whyImage from "../assets/why.jpg";
import traveler1 from "../assets/traveler1.png";
import traveler2 from "../assets/traveler2.png";
import traveler3 from "../assets/traveler3.png";

const FALLBACK_TEAM = [traveler1, traveler2, traveler3];

const ICONS = {
  diamond: <path d="M6 3h12l4 6-10 12L2 9z M2 9h20 M12 21 8 9 M12 21l4-12" />,
  bus: (
    <>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4z" />
      <path d="M4 15h16v3H4z M7 18v2M17 18v2" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="16" cy="11" r="1" />
    </>
  ),
  guide: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </>
  ),
  shield: <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6z" />,
  heart: <path d="M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 4.5-7 9-7 9z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2z" />
      <path d="M16 14a5 5 0 0 1 5 5v1h-4" />
    </>
  ),
  phone: (
    <path d="M5 3h4l2 5-3 2a13 13 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
};

const Icon = ({ name, className = "h-6 w-6", color = "#ff6900" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {ICONS[name] || ICONS.star}
  </svg>
);

const SectionTag = ({ children, center = false }) => (
  <p
    className={`font-montserrat text-sm font-bold uppercase tracking-[0.12em] text-[#ff6500] sm:text-lg ${
      center ? "text-center" : ""
    }`}
  >
    {children}
  </p>
);

export default function AboutPage() {
  const contact = useContact();
  const [about, setAbout] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setFailed(false);
        const [contentRes, reviewsRes] = await Promise.all([getContent(), getReviews()]);
        if (cancelled) return;
        setAbout(contentRes.data?.content?.about || {});
        setReviews((reviewsRes.data?.reviews || []).filter((item) => item.review).slice(0, 3));
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const intro = about?.intro || {};
  const story = about?.story || {};
  const why = about?.why || {};
  const team = about?.team || {};
  const testimonials = about?.testimonials || {};
  const cta = about?.cta || {};
  const banner = about?.banner || {};

  const stats = intro.stats?.length ? intro.stats : [];
  const trustPoints = story.trustPoints?.length ? story.trustPoints : [];
  const reasons = why.items?.length ? why.items : [];
  const members = team.members?.length ? team.members : [];
  const whatsappLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    "Hello Leela Tours! I want to know more about your tours."
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {failed && (
          <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-orange-300 bg-white px-5 py-4">
              <p className="font-montserrat text-sm font-semibold text-gray-700">
                About page ka content load nahi ho paya.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="rounded-full bg-[#07569b] px-6 py-2 font-montserrat text-sm font-semibold text-white transition hover:bg-[#064578] cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Banner */}
        <section className="relative w-full">
          <img
            src={banner.image || bannerImage}
            alt={banner.title || "About Leela Tours"}
            className="h-[240px] w-full object-cover sm:h-[320px] lg:h-[380px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07569b]/80 via-[#07569b]/40 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
              <h1 className="font-caladea text-4xl font-bold text-white drop-shadow sm:text-5xl lg:text-6xl">
                {banner.title || "About Us"}
              </h1>
              <nav aria-label="Breadcrumb" className="mt-3">
                <ol className="flex items-center gap-2 font-montserrat text-sm text-blue-100 sm:text-base">
                  <li>
                    <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white">
                      <Icon name="map" className="h-4 w-4" color="#ffffff" />
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/70">
                    &rsaquo;
                  </li>
                  <li className="font-semibold text-white">{banner.title || "About Us"}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>

        {/* Intro + stats + photo collage */}
        <section className="w-full py-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
            <div className="min-w-0">
              <SectionTag>{intro.tag || "About Leela Tours"}</SectionTag>

              <h2 className="mt-2 font-caladea text-3xl font-bold leading-tight text-[#07569b] sm:text-4xl lg:text-[44px]">
                {intro.title || "Your Trusted Travel Partner for Unforgettable Journeys"}
              </h2>

              <p className="mt-4 font-montserrat text-sm leading-relaxed text-gray-600 sm:text-base">
                {intro.text ||
                  "At Leela Tours, we believe travel is not just about visiting places, but about creating memories for a lifetime."}
              </p>

              {stats.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                      className="rounded-2xl border border-blue-100 bg-[#f2f8ff] px-3 py-4 text-center"
                    >
                      <Icon
                        name={["users", "map", "star", "clock"][index % 4]}
                        className="mx-auto h-6 w-6"
                        color="#07569b"
                      />
                      <p className="mt-2 font-caladea text-xl font-bold text-[#07569b] sm:text-2xl">
                        {stat.number}
                      </p>
                      <p className="mt-0.5 font-montserrat text-[11px] leading-snug text-gray-600 sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/categories/themed"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff6500] px-7 py-3 font-montserrat text-sm font-bold text-white shadow transition hover:bg-orange-600 sm:text-base"
              >
                {intro.ctaText || "Explore Our Tours"}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {/* Collage */}
            <div className="relative min-h-[320px] min-w-0 sm:min-h-[420px] lg:min-h-[520px]">
              {[0, 1, 2].map((slot) => {
                const src =
                  intro.images?.[slot] ||
                  (slot === 0 ? whyImage : slot === 1 ? tripImage : bannerImage);
                const positions = [
                  "left-[4%] top-[6%] h-[62%] w-[58%] rotate-[-4deg]",
                  "right-[2%] top-[2%] h-[42%] w-[38%] rotate-[6deg]",
                  "bottom-[2%] right-[10%] h-[46%] w-[44%] rotate-[-3deg]",
                ];
                return (
                  <div
                    key={slot}
                    className={`absolute overflow-hidden rounded-[20px] border-4 border-white shadow-xl ${positions[slot]}`}
                  >
                    <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="w-full bg-[#f2f8ff] py-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_1.4fr_1fr] lg:gap-12 lg:px-10">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[24px] border-4 border-white shadow-lg">
                <img
                  src={story.image || tripImage}
                  alt={story.title || "Leela Tours journey"}
                  className="h-[260px] w-full object-cover sm:h-[340px]"
                />
              </div>
            </div>

            <div className="min-w-0">
              <SectionTag>{story.tag || "Our Story"}</SectionTag>

              <h2 className="mt-2 font-caladea text-3xl font-bold leading-tight text-[#07569b] sm:text-4xl">
                {story.title || "A Journey of Passion and Trust"}
              </h2>

              <p className="mt-4 font-montserrat text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                {story.text1 ||
                  "Leela Tours was founded with a simple dream — to make travel Easy, Safe and Memorable for everyone."}
              </p>
              {story.text2 && (
                <p className="mt-3 font-montserrat text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                  {story.text2}
                </p>
              )}
            </div>

            {trustPoints.length > 0 && (
              <ul className="flex min-w-0 flex-col gap-5 lg:pl-4">
                {trustPoints.map((point, index) => (
                  <li key={`${point.title}-${index}`} className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#ffddc8] bg-white">
                      <Icon
                        name={["star", "shield", "phone", "heart"][index % 4]}
                        className="h-6 w-6"
                      />
                    </span>
                    <span className="font-montserrat text-sm font-semibold leading-snug text-gray-800 sm:text-[15px]">
                      {point.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Why choose us */}
        {reasons.length > 0 && (
          <section className="w-full py-14 md:py-20">
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
              <div className="flex items-center justify-center gap-4">
                <span className="hidden h-px w-16 bg-[#ffbb88] sm:block" />
                <SectionTag center>{why.tag || "Why Choose Us"}</SectionTag>
                <span className="hidden h-px w-16 bg-[#ffbb88] sm:block" />
              </div>

              <h2 className="mt-2 text-center font-caladea text-3xl font-bold text-[#07569b] sm:text-4xl">
                {why.title || "Your Perfect Travel Companion"}
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {reasons.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <Icon
                      name={item.icon}
                      className="mx-auto h-9 w-9"
                      color="#07569b"
                    />
                    <h3 className="mt-3 font-montserrat text-sm font-bold leading-snug text-gray-900 sm:text-[15px]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 font-montserrat text-xs leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        {members.length > 0 && (
          <section className="w-full bg-[#fff4ec] py-14 md:py-20">
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_2fr] lg:gap-14 lg:px-10">
              <div className="min-w-0">
                <SectionTag>{team.tag || "Our Team"}</SectionTag>

                <h2 className="mt-2 font-caladea text-3xl font-bold leading-tight text-[#07569b] sm:text-4xl">
                  {team.title || "Meet Our Travel Experts"}
                </h2>

                <p className="mt-4 font-montserrat text-sm leading-relaxed text-gray-600 sm:text-base">
                  {team.text ||
                    "Our dedicated team of travel experts is always ready to plan your perfect trip with care and personalized service."}
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff6500] px-7 py-3 font-montserrat text-sm font-bold text-white shadow transition hover:bg-orange-600 sm:text-base"
                >
                  {team.ctaText || "Know More"}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <article
                    key={`${member.name}-${index}`}
                    className="overflow-hidden rounded-[22px] bg-white shadow-md"
                  >
                    <img
                      src={member.photo || FALLBACK_TEAM[index % FALLBACK_TEAM.length]}
                      alt={member.name}
                      className="h-56 w-full object-cover"
                    />
                    <div className="px-4 py-4 text-center">
                      <h3 className="font-montserrat text-base font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="mt-1 font-montserrat text-xs text-gray-500">{member.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials from approved reviews */}
        <section className="w-full py-14 md:py-20">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden h-px w-16 bg-[#ffbb88] sm:block" />
              <SectionTag center>{testimonials.tag || "Testimonials"}</SectionTag>
              <span className="hidden h-px w-16 bg-[#ffbb88] sm:block" />
            </div>

            <h2 className="mt-2 text-center font-caladea text-3xl font-bold text-[#07569b] sm:text-4xl">
              {testimonials.title || "What Our Travellers Say"}
            </h2>

            {reviews.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                {reviews.map((item, index) => (
                  <article
                    key={item._id || index}
                    className="rounded-[22px] border border-gray-100 bg-white p-6 shadow-[0_2px_18px_rgba(0,0,0,0.08)]"
                  >
                    <span className="font-caladea text-4xl leading-none text-[#ffbb88]">&ldquo;</span>
                    <p className="mt-1 font-montserrat text-sm leading-relaxed text-gray-700">
                      {item.review}
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                      <img
                        src={item.photo || FALLBACK_TEAM[index % FALLBACK_TEAM.length]}
                        alt=""
                        aria-hidden="true"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-montserrat text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="font-montserrat text-xs text-gray-500">{item.tour}</p>
                      </div>
                      <p className="ml-auto shrink-0 font-montserrat text-xs tracking-wider text-amber-400">
                        {"★".repeat(Math.max(1, Math.min(5, Math.round(Number(item.rating) || 5))))}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-center font-montserrat text-sm text-gray-500">
                {failed
                  ? "Traveller reviews load nahi ho paye."
                  : "Abhi reviews publish nahi hue hain. Jaldi aa rahe hain."}
              </p>
            )}
          </div>
        </section>

        {/* CTA band */}
        <section className="w-full pb-16">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-[26px] bg-[#07569b] px-6 py-8 shadow-lg sm:px-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <Icon name="map" className="mt-1 h-8 w-8 shrink-0" color="#ffffff" />
                  <div>
                    <h2 className="font-caladea text-2xl font-bold text-white sm:text-3xl">
                      {cta.title || "Ready to Plan Your Next Trip?"}
                    </h2>
                    <p className="mt-1 font-montserrat text-sm text-blue-100 sm:text-base">
                      {cta.subtitle ||
                        "Let's turn your travel dreams into reality with Leela Tours."}
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#ff6500] px-7 py-3 font-montserrat text-sm font-bold text-white shadow transition hover:bg-orange-600 sm:text-base"
                >
                  <FaWhatsapp className="text-lg" />
                  {cta.buttonText || "Book on WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
