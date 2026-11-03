import mongoose from "mongoose";

const IMAGE_MAX = 8_000_000;

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    tourType: { type: String, default: "Themed Tour", trim: true, maxlength: 40 },
    category: { type: String, default: "Sacred Journeys", trim: true, maxlength: 80 },
    route: { type: String, default: "Srinagar · Gulmarg · Pahalgam", trim: true, maxlength: 200 },
    duration: { type: String, default: "6D/5N", trim: true, maxlength: 40 },
    price: { type: Number, required: true, default: 24999, min: 0, max: 10_000_000 },
    oldPrice: { type: Number, default: 28999, min: 0, max: 10_000_000 },
    rating: { type: Number, default: 4.9, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 126, min: 0, max: 1_000_000 },
    badge: { type: String, default: "Best Seller", trim: true, maxlength: 60 },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80",
      maxlength: IMAGE_MAX,
    },

    subHeading: { type: String, default: "itinerary-focused", trim: true, maxlength: 80 },
    dateSubtitle: { type: String, default: "6D / 5N · 12 Oct 2026", trim: true, maxlength: 120 },
    highlights: {
      durationText: { type: String, default: "6 days, 5 nights", trim: true, maxlength: 120 },
      groupSize: { type: String, default: "Up to 30 travellers", trim: true, maxlength: 120 },
      startEnd: { type: String, default: "Srinagar airport", trim: true, maxlength: 160 },
      meals: { type: String, default: "Breakfast and dinner", trim: true, maxlength: 200 },
      stay: { type: String, default: "Houseboat and 3 star hotels", trim: true, maxlength: 200 },
      bestFor: { type: String, default: "Families, couples, seniors", trim: true, maxlength: 200 },
    },

    departureCity: { type: String, default: "Srinagar airport", trim: true, maxlength: 120 },
    bookedPercent: { type: Number, default: 87, min: 0, max: 100 },
    seatsLeft: { type: Number, default: 4, min: 0, max: 100_000 },
    departureDates: [
      {
        _id: false,
        date: { type: String, required: true, trim: true, maxlength: 60 },
        seatsLeft: { type: Number, default: 4, min: 0, max: 100_000 },
      },
    ],

    itinerary: [
      {
        _id: false,
        day: { type: Number, required: true, min: 1, max: 60 },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        location: { type: String, default: "Srinagar", trim: true, maxlength: 120 },
        description: { type: String, default: "", trim: true, maxlength: 3000 },
        stay: { type: String, default: "", trim: true, maxlength: 200 },
        meals: { type: String, default: "", trim: true, maxlength: 200 },
      },
    ],

    inclusions: [{ type: String, trim: true, maxlength: 300 }],
    exclusions: [{ type: String, trim: true, maxlength: 300 }],

    videoTitle: { type: String, default: "Our Kashmir Trip Highlights", trim: true, maxlength: 160 },
    videoSubtitle: { type: String, default: "REAL TRIPS. REAL MEMORIES.", trim: true, maxlength: 120 },
    videoThumbnail: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
      maxlength: IMAGE_MAX,
    },
    videoUrl: {
      type: String,
      default: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      trim: true,
      maxlength: 500,
    },

    gallery: [{ type: String, maxlength: IMAGE_MAX }],

    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tourSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });
tourSchema.index({ tourType: 1, isActive: 1 });
tourSchema.index({ category: 1, isActive: 1 });
tourSchema.index({ createdAt: -1 });

export default mongoose.model("Tour", tourSchema);
