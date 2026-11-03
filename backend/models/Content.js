import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    number: { type: String, default: "0", trim: true, maxlength: 20 },
    label: { type: String, default: "", trim: true, maxlength: 40 },
  },
  { _id: false }
);

const trustPointSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 80 },
  },
  { _id: false }
);

const aboutFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 200 },
    icon: {
      type: String,
      default: "star",
      enum: ["diamond", "bus", "guide", "clock", "smile", "shield", "heart", "users", "phone", "map", "star"],
    },
  },
  { _id: false }
);

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true, maxlength: 60 },
    role: { type: String, default: "", trim: true, maxlength: 60 },
    photo: { type: String, default: "", maxlength: 3_000_000 },
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
    about: {
      banner: {
        image: { type: String, default: "", maxlength: 8_000_000 },
        title: { type: String, default: "About Us", trim: true, maxlength: 160 },
        subtitle: {
          type: String,
          default: "Get to know the people behind your journeys.",
          trim: true,
          maxlength: 300,
        },
      },
      intro: {
        tag: { type: String, default: "About Leela Tours", trim: true, maxlength: 80 },
        title: {
          type: String,
          default: "Your Trusted Travel Partner for Unforgettable Journeys",
          trim: true,
          maxlength: 160,
        },
        text: {
          type: String,
          default:
            "At Leela Tours, we believe travel is not just about visiting places, but about creating memories for a lifetime. With a passion for exploring the world and a commitment to excellence, we bring you the best travel experiences across India and beyond.",
          trim: true,
          maxlength: 2000,
        },
        ctaText: { type: String, default: "Explore Our Tours", trim: true, maxlength: 60 },
        stats: { type: [statSchema], default: () => [
          { number: "500+", label: "Happy Travellers" },
          { number: "40+", label: "Tour Packages" },
          { number: "20+", label: "Destinations" },
          { number: "10+", label: "Years of Experience" },
        ] },
        images: {
          type: [String],
          default: () => ["", "", ""],
        },
      },
      story: {
        tag: { type: String, default: "Our Story", trim: true, maxlength: 80 },
        title: { type: String, default: "A Journey of Passion and Trust", trim: true, maxlength: 160 },
        text1: {
          type: String,
          default:
            "Leela Tours was founded with a simple dream — to make travel Easy, Safe and Memorable for everyone. Over the years, we have helped thousands of travellers explore the beauty of India, from the serene mountains of Kashmir to the spiritual vibes of Kedarnath.",
          trim: true,
          maxlength: 2000,
        },
        text2: {
          type: String,
          default:
            "Today, we are proud to be one of the most trusted travel partners, known for our great service, affordable packages and customer-first approach.",
          trim: true,
          maxlength: 2000,
        },
        image: { type: String, default: "", maxlength: 8_000_000 },
        trustPoints: {
          type: [trustPointSchema],
          default: () => [
            { title: "Trusted by 500+ Travellers" },
            { title: "Safe & Reliable Travel" },
            { title: "24/7 Travel Support" },
            { title: "Memories for Lifetime" },
          ],
        },
      },
      why: {
        tag: { type: String, default: "Why Choose Us", trim: true, maxlength: 80 },
        title: { type: String, default: "Your Perfect Travel Companion", trim: true, maxlength: 160 },
        items: {
          type: [aboutFeatureSchema],
          default: () => [
            { title: "Best Tour Packages at Great Prices", description: "Hand-checked itineraries at prices that make sense.", icon: "diamond" },
            { title: "Comfortable Travel Experience", description: "Clean vehicles, verified stays and well-planned schedules.", icon: "bus" },
            { title: "Expert Travel Guides", description: "Local guides who know the routes, the stories and the shortcuts.", icon: "guide" },
            { title: "24/7 Customer Support", description: "One WhatsApp message away, from enquiry to return home.", icon: "clock" },
            { title: "Happy Customers Our Priority", description: "Trips shaped around families, couples, students and seniors.", icon: "smile" },
          ],
        },
      },
      team: {
        tag: { type: String, default: "Our Team", trim: true, maxlength: 80 },
        title: { type: String, default: "Meet Our Travel Experts", trim: true, maxlength: 160 },
        text: {
          type: String,
          default:
            "Our dedicated team of travel experts is always ready to plan your perfect trip with care and personalized service.",
          trim: true,
          maxlength: 1000,
        },
        ctaText: { type: String, default: "Know More", trim: true, maxlength: 60 },
        members: {
          type: [teamMemberSchema],
          default: () => [
            { name: "Mukesh Patel", role: "Founder & CEO", photo: "" },
            { name: "Neha Sharma", role: "Travel Consultant", photo: "" },
            { name: "Rohit Verma", role: "Tour Manager", photo: "" },
          ],
        },
      },
      testimonials: {
        tag: { type: String, default: "Testimonials", trim: true, maxlength: 80 },
        title: { type: String, default: "What Our Travellers Say", trim: true, maxlength: 160 },
      },
      cta: {
        title: { type: String, default: "Ready to Plan Your Next Trip?", trim: true, maxlength: 160 },
        subtitle: {
          type: String,
          default: "Let's turn your travel dreams into reality with Leela Tours.",
          trim: true,
          maxlength: 300,
        },
        buttonText: { type: String, default: "Book on WhatsApp", trim: true, maxlength: 60 },
      },
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
