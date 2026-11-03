import React, { useState, useEffect } from "react";
import { getFaqs } from "../../api/api";
import whatsappIcon from "../../assets/whatsapp.png";
import useContact from "../../hooks/useContact";

export default function FaqSection() {
  const contact = useContact();
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchFaqs = async () => {
      try {
        const res = await getFaqs();
        if (cancelled) return;
        if (res.data?.success && res.data.faqs?.length) {
          setFaqs(res.data.faqs);
          setFailed(false);
        }
      } catch (err) {
        if (!cancelled) setFailed(true);
      }
    };
    fetchFaqs();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const whatsappLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    "Hello Leela Tours, I have a question about your tours."
  )}`;

  return (
    <section id="faq-section" className="w-full bg-[#fff4eb] py-14 sm:py-18">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
        {/* Left Side */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-montserrat text-xl sm:text-2xl font-bold uppercase text-[#ff6500]">
              FAQs
            </p>

            <h2 className="mt-2 font-caladea text-4xl sm:text-5xl lg:text-[60px] font-bold leading-tight text-[#07569b]">
              Questions? We've
              <br />
              <span className="text-[#ff6500]">got answers</span>
            </h2>

            <p className="mt-5 max-w-[520px] font-montserrat text-base sm:text-xl leading-relaxed text-gray-600">
              Everything you need to know before you book. Still unsure? Just ask us directly on WhatsApp.
            </p>
          </div>

          {/* WhatsApp Card */}
          <div className="mt-8 flex min-h-[200px] max-w-[560px] flex-col justify-center rounded-[28px] bg-gradient-to-r from-[#034578] to-[#1e589c] p-7 sm:p-9 shadow-lg">
            <h3 className="font-caladea text-2xl sm:text-3xl font-bold text-white">
              Still have a question?
            </h3>

            <p className="mt-1 max-w-[380px] font-montserrat text-xs sm:text-sm leading-relaxed text-blue-200">
              Our travel experts reply on WhatsApp within 10 minutes, 9am to 9pm.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask Leela Tours on WhatsApp"
              className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-full bg-[#08a900] hover:bg-green-700 px-6 py-3 font-montserrat text-base sm:text-lg font-bold text-white shadow transition"
            >
              <img
                src={whatsappIcon}
                alt=""
                aria-hidden="true"
                className="h-6 w-6 shrink-0 object-contain"
              />
              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* Right Side: FAQ Accordion */}
        <div className="flex flex-col gap-3.5 lg:pt-4">
          {failed && faqs.length === 0 && (
            <div className="rounded-[18px] border-2 border-dashed border-orange-300 bg-white p-7 text-center">
              <p className="font-montserrat text-base font-semibold text-gray-700">
                FAQs load nahi ho paye.
              </p>
              <p className="mt-1 font-montserrat text-sm text-gray-500">
                Tab tak koi sawal ho to WhatsApp par pooch lein — ya neeche retry karein.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 rounded-full bg-[#07569b] px-6 py-2.5 font-montserrat text-sm font-semibold text-white transition hover:bg-[#064578] cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item._id || index}
                className={`overflow-hidden rounded-[18px] border-2 bg-white transition-all shadow-xs ${
                  isOpen ? "border-[#ff8500] shadow-md" : "border-orange-200 hover:border-orange-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="font-montserrat text-base sm:text-lg font-bold text-gray-900">
                    {item.question}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0d6] text-lg font-bold text-[#ff6500]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 font-montserrat text-sm leading-relaxed text-gray-600 border-t border-orange-50 pt-2">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
