import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    number: { type: String, default: "0", trim: true, maxlength: 20 },
    label: { type: String, default: "", trim: true, maxlength: 40 },
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    hero: {
      image: { type: String, default: "", maxlength: 8_000_000 },
      title: { type: String, default: "Get your trip price in 2 minutes", trim: true, maxlength: 160 },
      subtitle: {
        type: String,
        default: "Tell us a little and we'll send the best price on WhatsApp. Free, no obligation.",
        trim: true,
        maxlength: 500,
      },
      stats: { type: [statSchema], default: () => [
        { number: "500+", label: "Happy Travellers" },
        { number: "40+", label: "Tour Packages" },
        { number: "20+", label: "Destinations" },
        { number: "10+", label: "Years of Experience" },
      ] },
    },
    themedHero: {
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        maxlength: 8_000_000,
      },
      title: { type: String, default: "Themed Tours", trim: true, maxlength: 160 },
      subtitle: {
        type: String,
        default:
          "Handpicked journeys planned around who you travel with — romance, culture, adventure and spirituality.",
        trim: true,
        maxlength: 500,
      },
      badge: { type: String, default: "Curated Themed Experiences", trim: true, maxlength: 80 },
      stats: { type: [statSchema], default: () => [
        { number: "1,200+", label: "Happy Explorers" },
        { number: "35+", label: "Curated Itineraries" },
        { number: "15+", label: "Unique Themes" },
        { number: "10+", label: "Years of Trust" },
      ] },
    },
    groupHero: {
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=80",
        maxlength: 8_000_000,
      },
      title: { type: String, default: "Group Tours", trim: true, maxlength: 160 },
      subtitle: {
        type: String,
        default:
          "Fixed departures, verified itineraries, friendly small groups and memories for a lifetime.",
        trim: true,
        maxlength: 500,
      },
      badge: { type: String, default: "Small Group Departures", trim: true, maxlength: 80 },
      stats: { type: [statSchema], default: () => [
        { number: "500+", label: "Happy Group Travellers" },
        { number: "50+", label: "Group Trips" },
        { number: "20+", label: "Destinations" },
        { number: "10+", label: "Years of Experience" },
      ] },
    },
    offer: {
      tag: { type: String, default: "Festive Early Bird Offer", trim: true, maxlength: 80 },
      title: { type: String, default: "Save up to ₹4,000 on winter tours", trim: true, maxlength: 160 },
      subtitle: {
        type: String,
        default:
          "Book any Kashmir, Ladakh or Himachal tour before 31 October and get early bird prices plus a free airport pickup.",
        trim: true,
        maxlength: 500,
      },
      ctaText: { type: String, default: "Claim My Early Bird Price", trim: true, maxlength: 60 },
    },
    whyUs: {
      tag: { type: String, default: "Why Leela Tours", trim: true, maxlength: 80 },
      title: { type: String, default: "Travel like family, not like a tourist", trim: true, maxlength: 160 },
      subtitle: {
        type: String,
        default:
          "For over 10 years we have taken families, couples, students and seniors across India. We take care of the details so your only job is to enjoy the trip.",
        trim: true,
        maxlength: 500,
      },
      statsNumber: { type: String, default: "120+ travellers", trim: true, maxlength: 40 },
      statsLabel: { type: String, default: "booked with us this month", trim: true, maxlength: 60 },
    },
    contact: {
      phone: { type: String, default: "+91 98765 43210", trim: true, maxlength: 30 },
      email: { type: String, default: "info@leelatours.com", trim: true, maxlength: 254 },
      corporateOffice: {
        type: String,
        default:
          "Office No. 204, 2nd Floor, ABC Business Plaza, FC Road, Shivajinagar, Pune, Maharashtra 411005, India.",
        trim: true,
        maxlength: 500,
      },
      quickContact: { type: String, default: "Tel: +91 98765 43210\nFax: +91 98765 43210", trim: true, maxlength: 200 },
      whatsapp: { type: String, default: "919876543210", trim: true, maxlength: 20 },
      facebook: { type: String, default: "", trim: true, maxlength: 300 },
      instagram: { type: String, default: "", trim: true, maxlength: 300 },
    },
    footer: {
      aboutText: {
        type: String,
        default: "For over 10 years we have taken families, couples, students and seniors across India.",
        trim: true,
        maxlength: 1000,
      },
      phone: { type: String, default: "+91 98765 43210", trim: true, maxlength: 30 },
      email: { type: String, default: "leelatours@gmail.com", trim: true, maxlength: 254 },
      address: { type: String, default: "Pune, Maharashtra", trim: true, maxlength: 200 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Content", contentSchema);
