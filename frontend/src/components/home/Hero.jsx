import { useState, useEffect } from "react";
import heroImage from "../../assets/banner1.jpg";
import whatsappIcon from "../../assets/whatsapp.png";
import { getContent, submitEnquiry } from "../../api/api";
import useContact from "../../hooks/useContact";

export default function Hero() {
  const contact = useContact();
  const [destination, setDestination] = useState("Magical Kashmir");
  const [month, setMonth] = useState("2026-11");
  const [travellers, setTravellers] = useState(2);
  const [stats, setStats] = useState([
    { number: "500+", label: "Happy Travellers" },
    { number: "40+", label: "Tour Packages" },
    { number: "20+", label: "Destinations" },
    { number: "10+", label: "Years of Experience" },
  ]);
  const [heroContent, setHeroContent] = useState({
    image: "",
    title: "Get your trip price in 2 minutes",
    subtitle: "Tell us a little and we'll send the best price on WhatsApp. Free, no obligation.",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getContent();
        if (res.data?.success && res.data.content?.hero) {
          setHeroContent({
            image: res.data.content.hero.image || "",
            title: res.data.content.hero.title || "Get your trip price in 2 minutes",
            subtitle:
              res.data.content.hero.subtitle ||
              "Tell us a little and we'll send the best price on WhatsApp. Free, no obligation.",
          });
          if (res.data.content.hero.stats?.length) {
            setStats(res.data.content.hero.stats);
          }
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchContent();
  }, []);

  const handleQuote = async (e) => {
    e.preventDefault();

    // Log enquiry in backend
    try {
      await submitEnquiry({
        name: `Website Visitor (${destination})`,
        tourTitle: destination,
        departureDate: month,
        travellers,
        message: `Requested free quote for ${destination} in month ${month} for ${travellers} travellers.`,
        source: "whatsapp_click",
      });
    } catch (err) {
      // Non-blocking
    }

    const message = `Hello Leela Tours! I want a free trip quote.
Destination: ${destination}
Travel Month: ${month}
Travellers: ${travellers}`;

    window.open(
      `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="relative mb-16 w-full">
      {/* Hero Background */}
      <div
        className="relative min-h-[500px] bg-cover bg-center bg-no-repeat md:min-h-[460px]"
        style={{ backgroundImage: `url(${heroContent.image || heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-5 py-8 md:min-h-[420px] md:flex-row md:items-start md:justify-end md:px-10">
          {/* Quote Form */}
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl md:mr-[4%] md:mt-4">
            <h1 className="font-caladea text-[24px] font-bold leading-7 text-[#07569b]">
              {heroContent.title}
            </h1>

            <p className="mb-4 mt-1 font-montserrat text-[13px] leading-5 text-gray-600">
              {heroContent.subtitle}
            </p>

            <form onSubmit={handleQuote} className="space-y-3.5 font-montserrat">
              {/* Destination */}
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-gray-700">
                  Where do you want to go?
                </label>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  placeholder="Enter destination (e.g. Kashmir, Kerala, Rajasthan)"
                  className="h-9 w-full rounded-lg border border-gray-300 px-3 text-[13px] outline-none focus:border-blue-500"
                />
              </div>

              {/* Travel Month and Travellers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-gray-700">
                    When?
                  </label>

                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                    className="h-9 w-full rounded-lg border border-gray-300 px-2 text-[12px] outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-gray-700">
                    Travellers
                  </label>

                  <div className="flex h-9 items-center justify-between rounded-lg border border-gray-300 px-2">
                    <button
                      type="button"
                      onClick={() => setTravellers((n) => Math.max(1, n - 1))}
                      className="rounded bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800 cursor-pointer"
                      aria-label="Decrease travellers"
                    >
                      -
                    </button>

                    <span className="text-[13px] font-bold">{travellers}</span>

                    <button
                      type="button"
                      onClick={() => setTravellers((n) => Math.min(30, n + 1))}
                      className="rounded bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800 cursor-pointer"
                      aria-label="Increase travellers"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quote Button */}
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#08a000] hover:bg-green-700 text-[13px] font-bold text-white transition shadow cursor-pointer"
              >
                <img
                  src={whatsappIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />
                Get my free Quote
              </button>
            </form>

            <p className="mt-2.5 text-center font-montserrat text-[11px] text-gray-500">
              🔒 We never share your number. No spam, ever.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Bar */}
      <div className="relative z-10 mx-auto -mt-8 grid w-[90%] max-w-[1200px] grid-cols-2 rounded-2xl border-2 border-blue-200 bg-white/95 px-4 py-5 shadow-xl md:-mt-[55px] md:grid-cols-4 md:px-6 md:py-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center px-2 py-2 text-center ${
              index < stats.length - 1 ? "md:border-r-2 md:border-sky-500" : ""
            } ${
              index < 2 ? "border-b-2 border-sky-500 md:border-b-0" : ""
            }`}
          >
            <span className="font-montserrat text-[26px] font-extrabold leading-8 text-[#ff6500] md:text-[28px]">
              {item.number}
            </span>

            <span className="font-montserrat text-[13px] font-medium text-gray-900 md:text-[15px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
