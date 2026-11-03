import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import Tour from "../models/Tour.js";
import Content from "../models/Content.js";
import Review from "../models/Review.js";
import Faq from "../models/Faq.js";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const resolveAdminCredentials = () => {
  const email = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "";

  if (isProduction) {
    if (!email || !password || password.length < 8) {
      console.error(
        "Production seeding requires SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (min 8 characters). Aborting."
      );
      process.exit(1);
    }
    return { email, password };
  }

  const fallback = { email: email || "admin@leelatours.com", password: password || "admin123" };
  if (!email || !password) {
    console.warn(
      `[DEV ONLY] Using default admin credentials (${fallback.email} / ${fallback.password}). Never use these in production.`
    );
  }
  return fallback;
};

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI missing hai. .env file check karein.");
      process.exit(1);
    }

    // Seeding wipes data - require an explicit opt-in on production databases.
    if (isProduction && process.env.SEED_FORCE !== "yes") {
      console.error(
        "Refusing to seed in production because it deletes existing data. Set SEED_FORCE=yes to confirm."
      );
      process.exit(1);
    }

    const adminCredentials = resolveAdminCredentials();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing collections
    await Admin.deleteMany({});
    await Tour.deleteMany({});
    await Content.deleteMany({});
    await Review.deleteMany({});
    await Faq.deleteMany({});

    // 1. Create Default Admin
    await Admin.create({
      name: "Leela Admin",
      email: adminCredentials.email,
      password: adminCredentials.password,
    });
    console.log(`Admin created: ${adminCredentials.email}`);

    // 2. Create Tours matching Design & Images
    const kashmirTour = await Tour.create({
      title: "Magical Kashmir",
      tourType: "Themed Tour",
      category: "Romantic Escapes",
      route: "Srinagar · Gulmarg · Pahalgam",
      duration: "6D/5N",
      price: 24999,
      oldPrice: 28999,
      rating: 4.9,
      reviewsCount: 126,
      badge: "Best Seller",
      image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80",

      subHeading: "itinerary-focused",
      dateSubtitle: "6D / 5N · 12 Oct 2026",
      highlights: {
        durationText: "6 days, 5 nights",
        groupSize: "Up to 30 travellers",
        startEnd: "Srinagar airport",
        meals: "Breakfast and dinner",
        stay: "Houseboat and 3 star hotels",
        bestFor: "Families, couples, seniors",
      },

      departureCity: "Srinagar airport",
      bookedPercent: 87,
      seatsLeft: 4,
      departureDates: [
        { date: "24 Oct 2026 (4 seat left)", seatsLeft: 4 },
        { date: "05 Nov 2026 (6 seats left)", seatsLeft: 6 },
        { date: "18 Nov 2026 (8 seats left)", seatsLeft: 8 },
        { date: "02 Dec 2026 (5 seats left)", seatsLeft: 5 },
      ],

      itinerary: [
        {
          day: 1,
          title: "Welcome To Srinagar",
          location: "Srinagar",
          description:
            "Warm traditional welcome at Srinagar Airport. Transfer to your premium Houseboat on Dal Lake. Relax with authentic Kashmiri Kahwa tea. In the afternoon, enjoy a 1-hour relaxing Shikara ride on Dal Lake, visiting floating vegetable gardens, floating bazaar and Char Chinar.",
          stay: "Deluxe Houseboat, Dal Lake",
          meals: "Welcome Drink & Dinner",
        },
        {
          day: 2,
          title: "Srinagar to Gulmarg Excursion",
          location: "Gulmarg",
          description:
            "Post breakfast, drive through lush pine forests to Gulmarg ('Meadow of Flowers'). Enjoy the famous Gondola Cable Car Ride (Asia's highest cable car) up to Phase 1 & Phase 2. Enjoy breathtaking panoramic snow peaks, snowball fun, and golf course vistas. Evening return to Srinagar hotel.",
          stay: "3-Star Hotel, Srinagar",
          meals: "Breakfast & Dinner",
        },
        {
          day: 3,
          title: "Srinagar to Pahalgam Valley",
          location: "Pahalgam",
          description:
            "Journey to the valley of shepherds - Pahalgam. On the way, visit saffron fields at Pampore, Cricket bat manufacturing factories, and the historic Avantipur ruins. Reach Pahalgam and check into your riverside hotel. Relax along the banks of gushing Lidder River.",
          stay: "Riverside Resort, Pahalgam",
          meals: "Breakfast & Dinner",
        },
        {
          day: 4,
          title: "Pahalgam Local Exploration (Betaab & Aru Valley)",
          location: "Pahalgam",
          description:
            "Full day exploring Betaab Valley (named after the Bollywood movie), Chandanwari, and Aru Valley. Enjoy lush green meadows surrounded by snow-dusted peaks, pine valleys and gentle mountain streams. Taste local Kashmiri delicacies in town.",
          stay: "Riverside Resort, Pahalgam",
          meals: "Breakfast & Dinner",
        },
        {
          day: 5,
          title: "Pahalgam to Srinagar & Mughal Gardens",
          location: "Srinagar",
          description:
            "Drive back to Srinagar. Sightseeing of world-famous royal Mughal gardens: Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Visit the ancient Shankaracharya temple perched on a hilltop overlooking the Srinagar valley. Evening free for shopping dry fruits and shawls.",
          stay: "3-Star Hotel, Srinagar",
          meals: "Breakfast & Dinner",
        },
        {
          day: 6,
          title: "Departure from Srinagar Airport",
          location: "Srinagar",
          description:
            "Savor your last morning Kashmiri breakfast. Gather your memories and photographs. On-time private transfer to Srinagar Airport for your return flight home.",
          stay: "Checkout",
          meals: "Breakfast",
        },
      ],

      inclusions: [
        "5 nights stay, including 1 night on a houseboat",
        "Breakfast and dinner every day",
        "Private vehicle for all sightseeing",
        "Shikara ride on Dal Lake",
        "Airport pickup and drop in Srinagar",
        "Tour manager with the group all 6 days",
        "All tolls, parking and driver charges",
      ],

      exclusions: [
        "Flights or trains to Srinagar",
        "Gondola tickets and pony rides",
        "Lunch and personal expenses",
        "Travel insurance",
        "Anything not listed as included",
      ],

      videoTitle: "Our Kashmir Trip Highlights",
      videoSubtitle: "REAL TRIPS. REAL MEMORIES.",
      videoThumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
      videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
      gallery: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
      isActive: true,
    });

    // Seed additional featured tours for the Home Page
    const additionalTours = [
      {
        title: "Royal Rajasthan Heritage",
        tourType: "Themed Tour",
        category: "Heritage & Culture",
        route: "Jaipur · Jodhpur · Udaipur",
        duration: "7D/6N",
        price: 26499,
        oldPrice: 31999,
        rating: 4.8,
        reviewsCount: 94,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        subHeading: "palace-focused",
        dateSubtitle: "7D / 6N · 20 Nov 2026",
        highlights: {
          durationText: "7 days, 6 nights",
          groupSize: "Up to 25 travellers",
          startEnd: "Jaipur airport",
          meals: "Breakfast and authentic Rajasthani dinner",
          stay: "Heritage havelis & 4 star hotels",
          bestFor: "Families, culture lovers",
        },
        departureCity: "Jaipur airport",
        bookedPercent: 78,
        seatsLeft: 5,
        departureDates: [
          { date: "10 Nov 2026 (5 seats left)", seatsLeft: 5 },
          { date: "24 Nov 2026 (7 seats left)", seatsLeft: 7 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Pink City Jaipur", location: "Jaipur", description: "Check in to heritage hotel, visit Birla Temple and Chokhi Dhani.", stay: "Heritage Hotel", meals: "Dinner" },
          { day: 2, title: "Amer Fort & City Palace", location: "Jaipur", description: "Full day sightseeing Amer fort, Hawa Mahal, Jantar Mantar.", stay: "Heritage Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Jaipur to Jodhpur Blue City", location: "Jodhpur", description: "Drive to Jodhpur, explore Mehrangarh Fort and Jaswant Thada.", stay: "3-Star Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Jodhpur to Udaipur City of Lakes", location: "Udaipur", description: "Visit Ranakpur Jain temple en route to scenic Udaipur.", stay: "Lake View Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Udaipur Palace & Lake Pichola", location: "Udaipur", description: "Boat cruise on Lake Pichola, visit City Palace and Jag Mandir.", stay: "Lake View Hotel", meals: "Breakfast & Dinner" },
          { day: 6, title: "Saheliyon Ki Bari & Sunset", location: "Udaipur", description: "Explore historic gardens and local handicrafts market.", stay: "Lake View Hotel", meals: "Breakfast & Dinner" },
          { day: 7, title: "Departure from Udaipur Airport", location: "Udaipur", description: "Breakfast and airport drop with regal memories.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: [
          "6 nights heritage and 4-star hotel stay",
          "Daily breakfast and traditional dinners",
          "Private AC vehicle for all transfers",
          "Lake Pichola boat ride tickets",
          "Dedicated tour coordinator",
          "All toll taxes and parking charges",
        ],
        exclusions: [
          "Flight/train tickets to Jaipur",
          "Monument entry fees & camera permits",
          "Lunches and personal shopping",
          "Travel insurance",
        ],
        videoTitle: "Colors of Rajasthan Tour Memories",
        videoSubtitle: "REAL TRIPS. REAL MEMORIES.",
        videoThumbnail: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Varanasi, Prayagraj & Ayodhya Sacred Yatra",
        tourType: "Themed Tour",
        category: "Sacred Journeys",
        route: "Varanasi · Prayagraj · Ayodhya",
        duration: "5D/4N",
        price: 18999,
        oldPrice: 22999,
        rating: 4.9,
        reviewsCount: 142,
        badge: "Spiritual Special",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        subHeading: "sacred-journey",
        dateSubtitle: "5D / 4N · 10 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "Up to 25 travellers",
          startEnd: "Varanasi airport/railway station",
          meals: "Pure vegetarian breakfast & dinner",
          stay: "Comfort 3-Star AC hotels",
          bestFor: "Devotees, seniors, families",
        },
        departureCity: "Varanasi airport",
        bookedPercent: 90,
        seatsLeft: 3,
        departureDates: [
          { date: "10 Nov 2026 (3 seats left)", seatsLeft: 3 },
          { date: "24 Nov 2026 (5 seats left)", seatsLeft: 5 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Kashi & Evening Ganga Aarti", location: "Varanasi", description: "Grand boat ride on holy Ganga and witness divine Dashashwamedh Ghat Aarti.", stay: "Varanasi Hotel", meals: "Dinner" },
          { day: 2, title: "Kashi Vishwanath, Annapurna & Sarnath", location: "Varanasi", description: "VIP Darshan at Kashi Vishwanath temple corridor and visit Lord Buddha's Sarnath.", stay: "Varanasi Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Triveni Sangam Prayagraj Snan", location: "Prayagraj", description: "Drive to holy Sangam, holy bath, Hanuman Mandir & Anand Bhawan.", stay: "Prayagraj Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Ayodhya Ram Mandir Darshan", location: "Ayodhya", description: "Darshan at new Shri Ram Janmabhoomi temple, Hanumangarhi and Sarayu river aarti.", stay: "Ayodhya Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Departure from Ayodhya/Varanasi", location: "Varanasi", description: "Breakfast and departure with sacred blessings.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["4 nights AC hotel accommodation", "Daily pure veg breakfast and dinner", "Private AC coach for all sightseeing", "Ganga boat ride at Varanasi", "Assistance for Temple Darshan"],
        exclusions: ["Train/Flight tickets", "Special pooja or VIP donation slips", "Personal expenses"],
        videoTitle: "Spiritual Journey to Varanasi & Ayodhya",
        videoSubtitle: "DIVINE MEMORIES",
        videoThumbnail: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Golden Triangle Educational School Tour",
        tourType: "Group Tour",
        category: "School Group Tours",
        route: "Delhi · Agra · Jaipur",
        duration: "5D/4N",
        price: 14999,
        oldPrice: 17999,
        rating: 4.8,
        reviewsCount: 65,
        badge: "Student Special",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        subHeading: "educational-tour",
        dateSubtitle: "5D / 4N · 18 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "30-50 students + teachers",
          startEnd: "Delhi airport/railway",
          meals: "All meals (Breakfast, Lunch, Dinner)",
          stay: "Verified student-safe 3-Star hotels",
          bestFor: "Schools, colleges, student groups",
        },
        departureCity: "New Delhi",
        bookedPercent: 75,
        seatsLeft: 10,
        departureDates: [
          { date: "18 Nov 2026 (10 seats left)", seatsLeft: 10 },
          { date: "02 Dec 2026 (15 seats left)", seatsLeft: 15 },
        ],
        itinerary: [
          { day: 1, title: "Delhi Heritage & National Science Centre", location: "Delhi", description: "Visit India Gate, National Science Centre, and Rashtrapati Bhavan.", stay: "Delhi Hotel", meals: "Lunch & Dinner" },
          { day: 2, title: "Delhi to Agra - Taj Mahal & Agra Fort", location: "Agra", description: "Educational exploration of world wonder Taj Mahal and Mughal architecture.", stay: "Agra Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 3, title: "Fatehpur Sikri & Journey to Jaipur", location: "Jaipur", description: "Explore the ghost city of Emperor Akbar and arrive in pink city Jaipur.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 4, title: "Amer Fort & Jantar Mantar Astronomy", location: "Jaipur", description: "Astronomical learning session at UNESCO Jantar Mantar observatory and Amer fort.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 5, title: "Return to Delhi & Departure", location: "Delhi", description: "Return drive to Delhi for departure home.", stay: "Checkout", meals: "Breakfast & Lunch" },
        ],
        inclusions: ["All 3 meals daily", "Student-friendly deluxe AC coach", "Entry tickets & monument guides", "Complimentary stay for accompanying teachers", "Medical first-aid manager onboard"],
        exclusions: ["Personal student shopping", "Camera charges inside monuments"],
        videoTitle: "Golden Triangle Student Learning Tour",
        videoSubtitle: "LEARNING THROUGH TRAVEL",
        videoThumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "South India Temples & Backwaters Senior Special",
        tourType: "Group Tour",
        category: "Senior Group Tours",
        route: "Madurai · Rameswaram · Kanyakumari",
        duration: "6D/5N",
        price: 26999,
        oldPrice: 31999,
        rating: 4.9,
        reviewsCount: 94,
        badge: "Senior Citizen Care",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        subHeading: "comfortable-pace",
        dateSubtitle: "6D / 5N · 05 Dec 2026",
        highlights: {
          durationText: "6 days, 5 nights",
          groupSize: "Max 20 senior travellers",
          startEnd: "Madurai airport",
          meals: "Mild, fresh, healthy South & North Indian meals",
          stay: "Elevator-equipped star hotels close to temples",
          bestFor: "Senior citizens, retirees, peaceful travellers",
        },
        departureCity: "Madurai airport",
        bookedPercent: 85,
        seatsLeft: 4,
        departureDates: [
          { date: "05 Dec 2026 (4 seats left)", seatsLeft: 4 },
          { date: "19 Dec 2026 (6 seats left)", seatsLeft: 6 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Madurai & Meenakshi Amman Temple", location: "Madurai", description: "Relaxed arrival, wheelchair/battery car assistance for Meenakshi temple darshan.", stay: "Madurai Hotel", meals: "Dinner" },
          { day: 2, title: "Madurai to Rameswaram Island", location: "Rameswaram", description: "Scenic crossing across Pamban bridge, check into beach resort.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Ramanathaswamy Jyotirlinga Darshan & Dhanushkodi", location: "Rameswaram", description: "Holy Teertham holy bath and peaceful seaside drive to Dhanushkodi.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Rameswaram to Kanyakumari - Triveni Sangam", location: "Kanyakumari", description: "Arrive at tip of India, sunset view where 3 oceans meet.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Vivekananda Rock Memorial & Sunrise", location: "Kanyakumari", description: "Ferry ride to Vivekananda Rock, visit Bhagavathi Amman temple.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 6, title: "Trivandrum Airport Drop", location: "Trivandrum", description: "Drive to Trivandrum, optional Padmanabhaswamy darshan, departure.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["5 nights senior-accessible hotel stay", "Mild breakfast and dinner", "Slow-paced comfortable AC coach", "Wheelchair/battery car assistance at temples", "Dedicated tour manager trained for senior care"],
        exclusions: ["Flight/train tickets", "Personal medical expenses", "Pooja charges"],
        videoTitle: "Peaceful Senior Citizen Pilgrimage",
        videoSubtitle: "COMFORT & CARE",
        videoThumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Kerala Backwaters & Hills",
        tourType: "Themed Tour",
        category: "Romantic Escapes",
        route: "Kochi · Munnar · Thekkady · Alleppey",
        duration: "6D/5N",
        price: 22999,
        oldPrice: 26999,
        rating: 4.9,
        reviewsCount: 110,
        badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        subHeading: "nature-focused",
        dateSubtitle: "6D / 5N · 15 Nov 2026",
        highlights: {
          durationText: "6 days, 5 nights",
          groupSize: "Up to 24 travellers",
          startEnd: "Cochin airport",
          meals: "Breakfast and traditional Kerala meals",
          stay: "Tea estate resort & Alleppey houseboat",
          bestFor: "Honeymooners, couples, families",
        },
        departureCity: "Cochin airport",
        bookedPercent: 90,
        seatsLeft: 2,
        departureDates: [
          { date: "15 Nov 2026 (2 seats left)", seatsLeft: 2 },
          { date: "01 Dec 2026 (6 seats left)", seatsLeft: 6 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Cochin to Munnar", location: "Munnar", description: "Scenic drive through tea gardens and waterfalls to Munnar.", stay: "Tea Valley Resort", meals: "Dinner" },
          { day: 2, title: "Munnar Tea Estates & Mattupetty", location: "Munnar", description: "Tea museum, Echo point, Eravikulam National Park.", stay: "Tea Valley Resort", meals: "Breakfast & Dinner" },
          { day: 3, title: "Munnar to Thekkady Spice Plantations", location: "Thekkady", description: "Spice plantation tour and Kathakali cultural show.", stay: "Jungle Resort", meals: "Breakfast & Dinner" },
          { day: 4, title: "Thekkady to Alleppey Houseboat", location: "Alleppey", description: "Board traditional Kerala houseboat. Cruise through serene canals.", stay: "Deluxe Houseboat", meals: "Lunch, Dinner & Breakfast" },
          { day: 5, title: "Alleppey to Marari Beach", location: "Marari", description: "Relax at clean golden beach, Ayurvedic wellness sessions.", stay: "Beach Resort", meals: "Breakfast & Dinner" },
          { day: 6, title: "Departure from Cochin Airport", location: "Cochin", description: "Shopping for spices and transfer to airport.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: [
          "1 night private houseboat with all meals",
          "4 nights resort stays with breakfast & dinner",
          "Private AC transport for all routes",
          "Guided spice garden walking tour",
          "24/7 dedicated travel support",
        ],
        exclusions: [
          "Flight/train to Cochin",
          "Ayurvedic massage charges",
          "Lunch on hotel stay days",
          "Personal expenses",
        ],
        videoTitle: "Kerala God's Own Country Memories",
        videoSubtitle: "REAL TRIPS. REAL MEMORIES.",
        videoThumbnail: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Varanasi, Prayagraj & Ayodhya Sacred Yatra",
        tourType: "Themed Tour",
        category: "Sacred Journeys",
        route: "Varanasi · Prayagraj · Ayodhya",
        duration: "5D/4N",
        price: 18999,
        oldPrice: 22999,
        rating: 4.9,
        reviewsCount: 142,
        badge: "Spiritual Special",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        subHeading: "sacred-journey",
        dateSubtitle: "5D / 4N · 10 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "Up to 25 travellers",
          startEnd: "Varanasi airport/railway station",
          meals: "Pure vegetarian breakfast & dinner",
          stay: "Comfort 3-Star AC hotels",
          bestFor: "Devotees, seniors, families",
        },
        departureCity: "Varanasi airport",
        bookedPercent: 90,
        seatsLeft: 3,
        departureDates: [
          { date: "10 Nov 2026 (3 seats left)", seatsLeft: 3 },
          { date: "24 Nov 2026 (5 seats left)", seatsLeft: 5 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Kashi & Evening Ganga Aarti", location: "Varanasi", description: "Grand boat ride on holy Ganga and witness divine Dashashwamedh Ghat Aarti.", stay: "Varanasi Hotel", meals: "Dinner" },
          { day: 2, title: "Kashi Vishwanath, Annapurna & Sarnath", location: "Varanasi", description: "VIP Darshan at Kashi Vishwanath temple corridor and visit Lord Buddha's Sarnath.", stay: "Varanasi Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Triveni Sangam Prayagraj Snan", location: "Prayagraj", description: "Drive to holy Sangam, holy bath, Hanuman Mandir & Anand Bhawan.", stay: "Prayagraj Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Ayodhya Ram Mandir Darshan", location: "Ayodhya", description: "Darshan at new Shri Ram Janmabhoomi temple, Hanumangarhi and Sarayu river aarti.", stay: "Ayodhya Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Departure from Ayodhya/Varanasi", location: "Varanasi", description: "Breakfast and departure with sacred blessings.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["4 nights AC hotel accommodation", "Daily pure veg breakfast and dinner", "Private AC coach for all sightseeing", "Ganga boat ride at Varanasi", "Assistance for Temple Darshan"],
        exclusions: ["Train/Flight tickets", "Special pooja or VIP donation slips", "Personal expenses"],
        videoTitle: "Spiritual Journey to Varanasi & Ayodhya",
        videoSubtitle: "DIVINE MEMORIES",
        videoThumbnail: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Golden Triangle Educational School Tour",
        tourType: "Group Tour",
        category: "School Group Tours",
        route: "Delhi · Agra · Jaipur",
        duration: "5D/4N",
        price: 14999,
        oldPrice: 17999,
        rating: 4.8,
        reviewsCount: 65,
        badge: "Student Special",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        subHeading: "educational-tour",
        dateSubtitle: "5D / 4N · 18 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "30-50 students + teachers",
          startEnd: "Delhi airport/railway",
          meals: "All meals (Breakfast, Lunch, Dinner)",
          stay: "Verified student-safe 3-Star hotels",
          bestFor: "Schools, colleges, student groups",
        },
        departureCity: "New Delhi",
        bookedPercent: 75,
        seatsLeft: 10,
        departureDates: [
          { date: "18 Nov 2026 (10 seats left)", seatsLeft: 10 },
          { date: "02 Dec 2026 (15 seats left)", seatsLeft: 15 },
        ],
        itinerary: [
          { day: 1, title: "Delhi Heritage & National Science Centre", location: "Delhi", description: "Visit India Gate, National Science Centre, and Rashtrapati Bhavan.", stay: "Delhi Hotel", meals: "Lunch & Dinner" },
          { day: 2, title: "Delhi to Agra - Taj Mahal & Agra Fort", location: "Agra", description: "Educational exploration of world wonder Taj Mahal and Mughal architecture.", stay: "Agra Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 3, title: "Fatehpur Sikri & Journey to Jaipur", location: "Jaipur", description: "Explore the ghost city of Emperor Akbar and arrive in pink city Jaipur.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 4, title: "Amer Fort & Jantar Mantar Astronomy", location: "Jaipur", description: "Astronomical learning session at UNESCO Jantar Mantar observatory and Amer fort.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 5, title: "Return to Delhi & Departure", location: "Delhi", description: "Return drive to Delhi for departure home.", stay: "Checkout", meals: "Breakfast & Lunch" },
        ],
        inclusions: ["All 3 meals daily", "Student-friendly deluxe AC coach", "Entry tickets & monument guides", "Complimentary stay for accompanying teachers", "Medical first-aid manager onboard"],
        exclusions: ["Personal student shopping", "Camera charges inside monuments"],
        videoTitle: "Golden Triangle Student Learning Tour",
        videoSubtitle: "LEARNING THROUGH TRAVEL",
        videoThumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "South India Temples & Backwaters Senior Special",
        tourType: "Group Tour",
        category: "Senior Group Tours",
        route: "Madurai · Rameswaram · Kanyakumari",
        duration: "6D/5N",
        price: 26999,
        oldPrice: 31999,
        rating: 4.9,
        reviewsCount: 94,
        badge: "Senior Citizen Care",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        subHeading: "comfortable-pace",
        dateSubtitle: "6D / 5N · 05 Dec 2026",
        highlights: {
          durationText: "6 days, 5 nights",
          groupSize: "Max 20 senior travellers",
          startEnd: "Madurai airport",
          meals: "Mild, fresh, healthy South & North Indian meals",
          stay: "Elevator-equipped star hotels close to temples",
          bestFor: "Senior citizens, retirees, peaceful travellers",
        },
        departureCity: "Madurai airport",
        bookedPercent: 85,
        seatsLeft: 4,
        departureDates: [
          { date: "05 Dec 2026 (4 seats left)", seatsLeft: 4 },
          { date: "19 Dec 2026 (6 seats left)", seatsLeft: 6 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Madurai & Meenakshi Amman Temple", location: "Madurai", description: "Relaxed arrival, wheelchair/battery car assistance for Meenakshi temple darshan.", stay: "Madurai Hotel", meals: "Dinner" },
          { day: 2, title: "Madurai to Rameswaram Island", location: "Rameswaram", description: "Scenic crossing across Pamban bridge, check into beach resort.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Ramanathaswamy Jyotirlinga Darshan & Dhanushkodi", location: "Rameswaram", description: "Holy Teertham holy bath and peaceful seaside drive to Dhanushkodi.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Rameswaram to Kanyakumari - Triveni Sangam", location: "Kanyakumari", description: "Arrive at tip of India, sunset view where 3 oceans meet.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Vivekananda Rock Memorial & Sunrise", location: "Kanyakumari", description: "Ferry ride to Vivekananda Rock, visit Bhagavathi Amman temple.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 6, title: "Trivandrum Airport Drop", location: "Trivandrum", description: "Drive to Trivandrum, optional Padmanabhaswamy darshan, departure.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["5 nights senior-accessible hotel stay", "Mild breakfast and dinner", "Slow-paced comfortable AC coach", "Wheelchair/battery car assistance at temples", "Dedicated tour manager trained for senior care"],
        exclusions: ["Flight/train tickets", "Personal medical expenses", "Pooja charges"],
        videoTitle: "Peaceful Senior Citizen Pilgrimage",
        videoSubtitle: "COMFORT & CARE",
        videoThumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Himachal Mountain Bliss",
        tourType: "Group Tour",
        category: "Friends & Family Trips",
        route: "Shimla · Kullu · Manali · Solang",
        duration: "6D/5N",
        price: 21999,
        oldPrice: 25999,
        rating: 4.8,
        reviewsCount: 88,
        badge: "Special Deal",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        subHeading: "adventure-focused",
        dateSubtitle: "6D / 5N · 25 Nov 2026",
        highlights: {
          durationText: "6 days, 5 nights",
          groupSize: "Up to 30 travellers",
          startEnd: "Chandigarh airport",
          meals: "Breakfast and dinner buffet",
          stay: "Mountain view hotels & cottages",
          bestFor: "Friends, families, couples",
        },
        departureCity: "Chandigarh airport",
        bookedPercent: 82,
        seatsLeft: 6,
        departureDates: [
          { date: "20 Nov 2026 (6 seats left)", seatsLeft: 6 },
          { date: "05 Dec 2026 (8 seats left)", seatsLeft: 8 },
        ],
        itinerary: [
          { day: 1, title: "Chandigarh to Shimla Queen of Hills", location: "Shimla", description: "Scenic mountain drive, evening stroll at Mall Road & Ridge.", stay: "Shimla Hotel", meals: "Dinner" },
          { day: 2, title: "Kufri Snow View Point", location: "Kufri", description: "Visit Kufri amusement park, Himalayan nature park.", stay: "Shimla Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Shimla to Manali via Kullu Valley", location: "Manali", description: "Drive along Beas river, visit Kullu Shawl factory and rafting point.", stay: "Manali Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Solang Valley & Atal Tunnel", location: "Solang", description: "Paragliding, snow activities at Solang Valley, drive through Atal Tunnel.", stay: "Manali Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Manali Local Sightseeing & Hadimba Temple", location: "Manali", description: "Visit Hadimba temple, Vashisht hot springs, old Manali cafes.", stay: "Manali Hotel", meals: "Breakfast & Dinner" },
          { day: 6, title: "Manali to Chandigarh Departure", location: "Chandigarh", description: "Return drive to Chandigarh airport for flight home.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: [
          "5 nights stay in 3-star mountain view hotels",
          "Daily breakfast and dinner",
          "AC vehicle for transfer & sightseeing",
          "Experienced local mountain driver",
          "All toll taxes and parking charges",
        ],
        exclusions: [
          "Adventure activities fee (paragliding, rafting)",
          "Rohtang Pass special permit (if required)",
          "Lunches & beverages",
          "Travel insurance",
        ],
        videoTitle: "Himachal Snow Adventure Highlights",
        videoSubtitle: "REAL TRIPS. REAL MEMORIES.",
        videoThumbnail: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Varanasi, Prayagraj & Ayodhya Sacred Yatra",
        tourType: "Themed Tour",
        category: "Sacred Journeys",
        route: "Varanasi · Prayagraj · Ayodhya",
        duration: "5D/4N",
        price: 18999,
        oldPrice: 22999,
        rating: 4.9,
        reviewsCount: 142,
        badge: "Spiritual Special",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        subHeading: "sacred-journey",
        dateSubtitle: "5D / 4N · 10 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "Up to 25 travellers",
          startEnd: "Varanasi airport/railway station",
          meals: "Pure vegetarian breakfast & dinner",
          stay: "Comfort 3-Star AC hotels",
          bestFor: "Devotees, seniors, families",
        },
        departureCity: "Varanasi airport",
        bookedPercent: 90,
        seatsLeft: 3,
        departureDates: [
          { date: "10 Nov 2026 (3 seats left)", seatsLeft: 3 },
          { date: "24 Nov 2026 (5 seats left)", seatsLeft: 5 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Kashi & Evening Ganga Aarti", location: "Varanasi", description: "Grand boat ride on holy Ganga and witness divine Dashashwamedh Ghat Aarti.", stay: "Varanasi Hotel", meals: "Dinner" },
          { day: 2, title: "Kashi Vishwanath, Annapurna & Sarnath", location: "Varanasi", description: "VIP Darshan at Kashi Vishwanath temple corridor and visit Lord Buddha's Sarnath.", stay: "Varanasi Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Triveni Sangam Prayagraj Snan", location: "Prayagraj", description: "Drive to holy Sangam, holy bath, Hanuman Mandir & Anand Bhawan.", stay: "Prayagraj Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Ayodhya Ram Mandir Darshan", location: "Ayodhya", description: "Darshan at new Shri Ram Janmabhoomi temple, Hanumangarhi and Sarayu river aarti.", stay: "Ayodhya Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Departure from Ayodhya/Varanasi", location: "Varanasi", description: "Breakfast and departure with sacred blessings.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["4 nights AC hotel accommodation", "Daily pure veg breakfast and dinner", "Private AC coach for all sightseeing", "Ganga boat ride at Varanasi", "Assistance for Temple Darshan"],
        exclusions: ["Train/Flight tickets", "Special pooja or VIP donation slips", "Personal expenses"],
        videoTitle: "Spiritual Journey to Varanasi & Ayodhya",
        videoSubtitle: "DIVINE MEMORIES",
        videoThumbnail: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "Golden Triangle Educational School Tour",
        tourType: "Group Tour",
        category: "School Group Tours",
        route: "Delhi · Agra · Jaipur",
        duration: "5D/4N",
        price: 14999,
        oldPrice: 17999,
        rating: 4.8,
        reviewsCount: 65,
        badge: "Student Special",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        subHeading: "educational-tour",
        dateSubtitle: "5D / 4N · 18 Nov 2026",
        highlights: {
          durationText: "5 days, 4 nights",
          groupSize: "30-50 students + teachers",
          startEnd: "Delhi airport/railway",
          meals: "All meals (Breakfast, Lunch, Dinner)",
          stay: "Verified student-safe 3-Star hotels",
          bestFor: "Schools, colleges, student groups",
        },
        departureCity: "New Delhi",
        bookedPercent: 75,
        seatsLeft: 10,
        departureDates: [
          { date: "18 Nov 2026 (10 seats left)", seatsLeft: 10 },
          { date: "02 Dec 2026 (15 seats left)", seatsLeft: 15 },
        ],
        itinerary: [
          { day: 1, title: "Delhi Heritage & National Science Centre", location: "Delhi", description: "Visit India Gate, National Science Centre, and Rashtrapati Bhavan.", stay: "Delhi Hotel", meals: "Lunch & Dinner" },
          { day: 2, title: "Delhi to Agra - Taj Mahal & Agra Fort", location: "Agra", description: "Educational exploration of world wonder Taj Mahal and Mughal architecture.", stay: "Agra Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 3, title: "Fatehpur Sikri & Journey to Jaipur", location: "Jaipur", description: "Explore the ghost city of Emperor Akbar and arrive in pink city Jaipur.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 4, title: "Amer Fort & Jantar Mantar Astronomy", location: "Jaipur", description: "Astronomical learning session at UNESCO Jantar Mantar observatory and Amer fort.", stay: "Jaipur Hotel", meals: "Breakfast, Lunch & Dinner" },
          { day: 5, title: "Return to Delhi & Departure", location: "Delhi", description: "Return drive to Delhi for departure home.", stay: "Checkout", meals: "Breakfast & Lunch" },
        ],
        inclusions: ["All 3 meals daily", "Student-friendly deluxe AC coach", "Entry tickets & monument guides", "Complimentary stay for accompanying teachers", "Medical first-aid manager onboard"],
        exclusions: ["Personal student shopping", "Camera charges inside monuments"],
        videoTitle: "Golden Triangle Student Learning Tour",
        videoSubtitle: "LEARNING THROUGH TRAVEL",
        videoThumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        title: "South India Temples & Backwaters Senior Special",
        tourType: "Group Tour",
        category: "Senior Group Tours",
        route: "Madurai · Rameswaram · Kanyakumari",
        duration: "6D/5N",
        price: 26999,
        oldPrice: 31999,
        rating: 4.9,
        reviewsCount: 94,
        badge: "Senior Citizen Care",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        subHeading: "comfortable-pace",
        dateSubtitle: "6D / 5N · 05 Dec 2026",
        highlights: {
          durationText: "6 days, 5 nights",
          groupSize: "Max 20 senior travellers",
          startEnd: "Madurai airport",
          meals: "Mild, fresh, healthy South & North Indian meals",
          stay: "Elevator-equipped star hotels close to temples",
          bestFor: "Senior citizens, retirees, peaceful travellers",
        },
        departureCity: "Madurai airport",
        bookedPercent: 85,
        seatsLeft: 4,
        departureDates: [
          { date: "05 Dec 2026 (4 seats left)", seatsLeft: 4 },
          { date: "19 Dec 2026 (6 seats left)", seatsLeft: 6 },
        ],
        itinerary: [
          { day: 1, title: "Arrival in Madurai & Meenakshi Amman Temple", location: "Madurai", description: "Relaxed arrival, wheelchair/battery car assistance for Meenakshi temple darshan.", stay: "Madurai Hotel", meals: "Dinner" },
          { day: 2, title: "Madurai to Rameswaram Island", location: "Rameswaram", description: "Scenic crossing across Pamban bridge, check into beach resort.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 3, title: "Ramanathaswamy Jyotirlinga Darshan & Dhanushkodi", location: "Rameswaram", description: "Holy Teertham holy bath and peaceful seaside drive to Dhanushkodi.", stay: "Rameswaram Hotel", meals: "Breakfast & Dinner" },
          { day: 4, title: "Rameswaram to Kanyakumari - Triveni Sangam", location: "Kanyakumari", description: "Arrive at tip of India, sunset view where 3 oceans meet.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 5, title: "Vivekananda Rock Memorial & Sunrise", location: "Kanyakumari", description: "Ferry ride to Vivekananda Rock, visit Bhagavathi Amman temple.", stay: "Kanyakumari Hotel", meals: "Breakfast & Dinner" },
          { day: 6, title: "Trivandrum Airport Drop", location: "Trivandrum", description: "Drive to Trivandrum, optional Padmanabhaswamy darshan, departure.", stay: "Checkout", meals: "Breakfast" },
        ],
        inclusions: ["5 nights senior-accessible hotel stay", "Mild breakfast and dinner", "Slow-paced comfortable AC coach", "Wheelchair/battery car assistance at temples", "Dedicated tour manager trained for senior care"],
        exclusions: ["Flight/train tickets", "Personal medical expenses", "Pooja charges"],
        videoTitle: "Peaceful Senior Citizen Pilgrimage",
        videoSubtitle: "COMFORT & CARE",
        videoThumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
        gallery: [
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        ],
        isFeatured: true,
        isActive: true,
      },
    ];

    await Tour.insertMany(additionalTours);
    console.log(" Tours seeded successfully (including Magical Kashmir)");

    // 3. Create Content
    await Content.create({
      hero: {
        image: "",
        title: "Get your trip price in 2 minutes",
        subtitle: "Tell us a little and we'll send the best price on WhatsApp. Free, no obligation.",
        stats: [
          { number: "500+", label: "Happy Travellers" },
          { number: "40+", label: "Tour Packages" },
          { number: "20+", label: "Destinations" },
          { number: "10+", label: "Years of Experience" },
        ],
      },
      themedHero: {
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        title: "Themed Tours",
        subtitle: "Handpicked journeys planned around who you travel with — romance, culture, adventure and spirituality.",
        badge: "Curated Themed Experiences",
        stats: [
          { number: "1,200+", label: "Happy Explorers" },
          { number: "35+", label: "Curated Itineraries" },
          { number: "15+", label: "Unique Themes" },
          { number: "10+", label: "Years of Trust" },
        ],
      },
      groupHero: {
        image: "",
        title: "Group Tours",
        subtitle: "Fixed departures, verified itineraries, friendly small groups and memories for a lifetime.",
        badge: "Small Group Departures",
        stats: [
          { number: "500+", label: "Happy Group Travellers" },
          { number: "50+", label: "Group Trips" },
          { number: "20+", label: "Destinations" },
          { number: "10+", label: "Years of Experience" },
        ],
      },
      offer: {
        tag: "Festive Early Bird Offer",
        title: "Save up to ₹4,000 on winter tours",
        subtitle: "Book any Kashmir, Ladakh or Himachal tour before 31 October and get early bird prices plus a free airport pickup.",
        ctaText: "Claim My Early Bird Price",
      },
      whyUs: {
        tag: "Why Leela Tours",
        title: "Travel like family, not like a tourist",
        subtitle: "For over 10 years we have taken families, couples, students and seniors across India. We take care of the details so your only job is to enjoy the trip.",
        statsNumber: "120+ travellers",
        statsLabel: "booked with us this month",
      },
      contact: {
        phone: "+91 98765 43210",
        email: "info@leelatours.com",
        corporateOffice: "Office No. 204, 2nd Floor, ABC Business Plaza, FC Road, Shivajinagar, Pune, Maharashtra 411005, India.",
        quickContact: "Tel: +91 98765 43210\nFax: +91 98765 43210",
        whatsapp: "919876543210",
        facebook: "https://www.facebook.com/leelatours",
        instagram: "https://www.instagram.com/leelatours",
      },
      footer: {
        aboutText: "For over 10 years we have taken families, couples, students and seniors across India. Handpicked stays, transparent pricing, and unforgettable journeys.",
        phone: "+91 98765 43210",
        email: "leelatours@gmail.com",
        address: "Pune, Maharashtra",
      },
    });
    console.log(" Site content seeded");

    // 4. Create Reviews
    await Review.insertMany([
      {
        name: "Rahul Patil",
        tour: "Magical Kashmir",
        review: "Everything was sorted from the first WhatsApp message. Hotels were better than we expected and our tour manager knew every good place to eat. My parents still talk about Gulmarg.",
        rating: 5,
        isApproved: true,
      },
      {
        name: "Sneha Kulkarni",
        tour: "Kerala Backwaters & Hills",
        review: "We wanted a relaxed honeymoon and that is exactly what we got. The houseboat night was magical. Leela Tours even arranged a cake on our last day without us asking.",
        rating: 5,
        isApproved: true,
      },
      {
        name: "Suresh Sharma",
        tour: "Magical Kashmir",
        review: "At 68 I was worried about the pace. The trip was easy, the hotels were comfortable and the places were very well planned. I would happily travel with them again.",
        rating: 5,
        isApproved: true,
      },
      {
        name: "Priya Verma",
        tour: "Royal Rajasthan Heritage",
        review: "Our family trip was wonderful. The itinerary was well planned, the hotels were clean and every detail was handled smoothly. We made memories we will never forget.",
        rating: 5,
        isApproved: true,
      },
      {
        name: "Amit Singh",
        tour: "Royal Rajasthan Heritage",
        review: "The destinations, local guides and hotel arrangements were excellent. The team was always available on WhatsApp whenever we needed help during the trip.",
        rating: 5,
        isApproved: true,
      },
      {
        name: "Neha Mehta",
        tour: "Himachal Mountain Bliss",
        review: "Beautiful mountain views and a stress-free holiday. Everything was arranged in advance and our family really enjoyed the entire experience.",
        rating: 5,
        isApproved: true,
      },
    ]);
    console.log(" Reviews seeded");

    // 5. Create FAQs
    await Faq.insertMany([
      {
        question: "How can I Book a Tour?",
        answer: "Booking is simple! Explore our tours, choose your preferred destination and contact Leela Tours on WhatsApp. Our travel team will help you with dates, availability, pricing and the booking process.",
        order: 1,
      },
      {
        question: "What is included in the tour package?",
        answer: "Inclusions depend on the package. They include comfortable hotel stays, sightseeing transfers, shikara rides, daily breakfast & dinner, and dedicated tour manager as shown in the tour details.",
        order: 2,
      },
      {
        question: "Can I customize my tour package?",
        answer: "Yes! You can discuss your preferred destinations, travel dates, group size and budget with our team on WhatsApp. We will customize a plan tailored to your needs.",
        order: 3,
      },
      {
        question: "How can I make a payment?",
        answer: "You can hold your seat with a small advance via UPI, Net Banking or Card. The remaining amount is payable before the trip starts. Everything is documented in writing.",
        order: 4,
      },
      {
        question: "What if I need to cancel or change my trip?",
        answer: "Contact us as soon as possible on WhatsApp. We offer flexible rescheduling options and transparent cancellation terms as per airline and hotel policies.",
        order: 5,
      },
    ]);
    console.log(" FAQs seeded");

    console.log("\n All database seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
