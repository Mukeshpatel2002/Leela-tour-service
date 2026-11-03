
import whatsappIcon from "../assets/whatsapp.png";

function RedyToBook() {
  return (
    <section className="w-full bg-white py-10 sm:py-12">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] rounded-[30px] bg-gradient-to-r from-[#ff6500] to-[#ff8500] px-5 py-10 text-center sm:w-[calc(100%-80px)] sm:px-10 sm:py-12 lg:mx-[80px] lg:w-[calc(100%-160px)] lg:px-16 lg:py-10">
        {/* Heading */}
        <h2 className="font-caladea text-4xl font-bold leading-tight text-white underline decoration-2 underline-offset-4 sm:text-5xl md:text-6xl lg:text-[64px]">
          Ready To Book Your Trip?
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-[850px] font-montserrat text-base leading-relaxed text-orange-100 sm:text-xl md:text-2xl">
          Share Your Tour Details With Us On WhatsApp And Our Team Will
          Help You Complete Your Booking.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919876543210?text=Hello%20Leela%20Tours%2C%20I%20want%20to%20book%20a%20trip."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book your trip on WhatsApp"
            className="inline-flex w-full max-w-[485px] items-center justify-center gap-3 rounded-full bg-[#08a900] px-5 py-3 text-xl font-medium text-white transition hover:bg-green-700 sm:w-auto sm:px-9 sm:py-3"
          >
            <img
              src={whatsappIcon}
              alt=""
              aria-hidden="true"
              className="h-9 w-9 shrink-0 object-contain"
            />

            <span className="whitespace-nowrap">Book On WhatsApp</span>
          </a>

          {/* Call Button */}
          <a
            href="tel:+919876543210"
            aria-label="Call Leela Tours"
            className="inline-flex w-full max-w-[450px] items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-xl font-medium text-gray-900 transition hover:bg-orange-50 sm:w-auto sm:px-9 sm:py-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 shrink-0"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.46.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2Z" />
            </svg>

            <span className="whitespace-nowrap">+91 XXXXX XXXXX</span>
          </a>
        </div>

        {/* Bottom Tagline */}
        <p className="mt-6 font-montserrat text-sm text-orange-100 sm:text-lg md:text-2xl">
          Quick Response · Easy Booking · Expert Assistance
        </p>
      </div>
    </section>
  );
}

export default RedyToBook;