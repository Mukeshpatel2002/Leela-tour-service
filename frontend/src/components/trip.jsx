
import tripImage from "../assets/trip.jpg";
import whatsappIcon from "../assets/whatsapp.png";

const trips = [
  {
    id: 1,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
  {
    id: 2,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
  {
    id: 3,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
  {
    id: 4,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
  {
    id: 5,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
  {
    id: 6,
    title: "Magical Kashmir",
    category: "Mountains",
    location: "Srinagar · Gulmarg · Pahalgam",
    duration: "6D/5N",
    price: "₹24,999",
    oldPrice: "₹28,999",
    rating: "4.9",
    reviews: "126 reviews",
    booked: 82,
    seats: 4,
  },
];

function TripCard({ trip }) {
  const whatsappMessage = encodeURIComponent(
    `Hello Leela Tours! I am interested in ${trip.title}. Please share the tour details.`
  );

  return (
    <article className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Trip Image */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={tripImage}
          alt={trip.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 font-montserrat text-[14px] font-semibold text-white">
          Best Seller
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 font-montserrat text-[14px] font-semibold text-[#07569b]">
          {trip.duration}
        </span>
      </div>

      {/* Trip Details */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-montserrat text-[14px] text-gray-500">
            {trip.category}
          </span>

          <span className="whitespace-nowrap font-montserrat text-[13px] text-gray-600">
            ★ {trip.rating} ({trip.reviews})
          </span>
        </div>

        <h3 className="mt-1 font-caladea text-[26px] font-bold leading-8 text-[#07569b]">
          {trip.title}
        </h3>

        <p className="truncate font-montserrat text-[14px] text-gray-500">
          {trip.location}
        </p>

        {/* Booking Progress */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between gap-2 font-montserrat text-[12px] text-gray-600">
            <span>{trip.booked}% booked</span>
            <span>♨ Only {trip.seats} seats left</span>
          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${trip.booked}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="font-montserrat text-[13px] text-gray-600">
              Starting from
            </p>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-montserrat text-[21px] font-extrabold leading-6 text-black">
                {trip.price}
              </span>

              <span className="font-montserrat text-[13px] text-gray-400 line-through">
                {trip.oldPrice}
              </span>
            </div>

            <p className="font-montserrat text-[12px] text-gray-500">
              per person
            </p>
          </div>

          <span className="mb-1 whitespace-nowrap rounded-full bg-green-50 px-2 py-1 font-montserrat text-[12px] font-medium text-green-600">
            Save ₹4,000
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href="/contact"
            className="flex-1 rounded-full border border-gray-400 px-2 py-2 text-center font-montserrat text-[14px] font-medium text-gray-900 transition hover:bg-gray-100"
          >
            View Details
          </a>

          {/* WhatsApp Button with Image Icon */}
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-green-600 px-2 py-2 font-montserrat text-[14px] font-semibold text-white transition hover:bg-green-700"
          >
            <img
              src={whatsappIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 shrink-0 object-contain"
            />

            Book on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Trip() {
  return (
    <section className="mx-auto mt-[100px] mb-[80px] w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      {/* Section Heading */}
      <div className="mb-6">
        <p className="font-montserrat text-[20px] font-bold uppercase tracking-wide text-orange-500">
          Upcoming Departures
        </p>

        <h2 className="font-caladea text-[42px] font-bold leading-tight text-[#07569b] sm:text-[50px] md:text-[56px]">
          Trips leaving soon
        </h2>

        <p className="mt-2 max-w-[560px] font-montserrat text-[18px] leading-[1.5] text-gray-800">
          Fixed dates, small groups and seats that fill up fast. Pick your trip
          and lock your seat on WhatsApp.
        </p>
      </div>

      {/* Six Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}

export default Trip;
