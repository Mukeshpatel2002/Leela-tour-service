import Tour from "../models/Tour.js";
import { ApiError } from "../utils/ApiError.js";
import {
  isPlainObject,
  optionalBoolean,
  optionalImage,
  optionalNumber,
  optionalString,
  optionalUrl,
  pickFields,
  requireArray,
  requireNumber,
  requireString,
} from "../utils/validation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const TOUR_FIELDS = [
  "title",
  "tourType",
  "category",
  "route",
  "duration",
  "price",
  "oldPrice",
  "rating",
  "reviewsCount",
  "badge",
  "image",
  "subHeading",
  "dateSubtitle",
  "highlights",
  "departureCity",
  "bookedPercent",
  "seatsLeft",
  "departureDates",
  "itinerary",
  "inclusions",
  "exclusions",
  "videoTitle",
  "videoSubtitle",
  "videoThumbnail",
  "videoUrl",
  "gallery",
  "isFeatured",
  "isActive",
];

const parseStringList = (value, field, { maxItems = 40, maxLength = 300 } = {}) =>
  requireArray(value, field, { min: 0, max: maxItems }).map((item, index) =>
    requireString(item, `${field} item ${index + 1}`, { min: 0, max: maxLength })
  );

const parseHighlights = (value) => {
  if (!isPlainObject(value)) throw new ApiError(400, "Highlights object hona chahiye.");
  const data = pickFields(value, [
    "durationText",
    "groupSize",
    "startEnd",
    "meals",
    "stay",
    "bestFor",
  ]);
  const parsed = {};
  const limits = {
    durationText: 120,
    groupSize: 120,
    startEnd: 160,
    meals: 200,
    stay: 200,
    bestFor: 200,
  };
  Object.entries(data).forEach(([key, raw]) => {
    parsed[key] = optionalString(raw, `Highlights ${key}`, { max: limits[key] });
  });
  return parsed;
};

const parseDepartureDates = (value) =>
  requireArray(value, "Departure dates", { min: 0, max: 30 }).map((item, index) => {
    if (!isPlainObject(item)) {
      throw new ApiError(400, `Departure date ${index + 1} object hona chahiye.`);
    }
    return {
      date: requireString(item.date, `Departure date ${index + 1}`, { min: 1, max: 60 }),
      seatsLeft: optionalNumber(item.seatsLeft, `Departure date ${index + 1} seats`, {
        min: 0,
        max: 100_000,
        integer: true,
        fallback: 0,
      }),
    };
  });

const parseItinerary = (value) =>
  requireArray(value, "Itinerary", { min: 0, max: 60 }).map((item, index) => {
    if (!isPlainObject(item)) {
      throw new ApiError(400, `Itinerary day ${index + 1} object hona chahiye.`);
    }
    return {
      day: requireNumber(item.day, `Itinerary day ${index + 1}`, {
        min: 1,
        max: 60,
        integer: true,
      }),
      title: requireString(item.title, `Itinerary day ${index + 1} title`, { min: 1, max: 200 }),
      location: optionalString(item.location, `Itinerary day ${index + 1} location`, { max: 120 }),
      description: optionalString(item.description, `Itinerary day ${index + 1} description`, {
        max: 3000,
      }),
      stay: optionalString(item.stay, `Itinerary day ${index + 1} stay`, { max: 200 }),
      meals: optionalString(item.meals, `Itinerary day ${index + 1} meals`, { max: 200 }),
    };
  });

const parseTour = (body) => {
  if (!isPlainObject(body)) throw new ApiError(400, "Tour data valid object hona chahiye.");
  const data = pickFields(body, TOUR_FIELDS);
  const parsed = {};

  if (data.title !== undefined) parsed.title = requireString(data.title, "Tour title", { min: 2, max: 160 });
  if (data.tourType !== undefined) {
    parsed.tourType = optionalString(data.tourType, "Tour type", { max: 40 });
  }
  if (data.category !== undefined) {
    parsed.category = optionalString(data.category, "Category", { max: 80 });
  }
  if (data.route !== undefined) parsed.route = optionalString(data.route, "Route", { max: 200 });
  if (data.duration !== undefined) parsed.duration = optionalString(data.duration, "Duration", { max: 40 });
  if (data.price !== undefined) {
    parsed.price = requireNumber(data.price, "Price", { min: 0, max: 10_000_000 });
  }
  if (data.oldPrice !== undefined) {
    parsed.oldPrice = optionalNumber(data.oldPrice, "Old price", { min: 0, max: 10_000_000 });
  }
  if (data.rating !== undefined) {
    parsed.rating = optionalNumber(data.rating, "Rating", { min: 0, max: 5 });
  }
  if (data.reviewsCount !== undefined) {
    parsed.reviewsCount = optionalNumber(data.reviewsCount, "Reviews count", {
      min: 0,
      max: 1_000_000,
      integer: true,
    });
  }
  if (data.badge !== undefined) parsed.badge = optionalString(data.badge, "Badge", { max: 60 });
  if (data.image !== undefined) parsed.image = optionalImage(data.image, "Tour image");
  if (data.subHeading !== undefined) {
    parsed.subHeading = optionalString(data.subHeading, "Sub heading", { max: 80 });
  }
  if (data.dateSubtitle !== undefined) {
    parsed.dateSubtitle = optionalString(data.dateSubtitle, "Date subtitle", { max: 120 });
  }
  if (data.highlights !== undefined) parsed.highlights = parseHighlights(data.highlights);
  if (data.departureCity !== undefined) {
    parsed.departureCity = optionalString(data.departureCity, "Departure city", { max: 120 });
  }
  if (data.bookedPercent !== undefined) {
    parsed.bookedPercent = optionalNumber(data.bookedPercent, "Booked percent", { min: 0, max: 100 });
  }
  if (data.seatsLeft !== undefined) {
    parsed.seatsLeft = optionalNumber(data.seatsLeft, "Seats left", {
      min: 0,
      max: 100_000,
      integer: true,
    });
  }
  if (data.departureDates !== undefined) {
    parsed.departureDates = parseDepartureDates(data.departureDates);
  }
  if (data.itinerary !== undefined) parsed.itinerary = parseItinerary(data.itinerary);
  if (data.inclusions !== undefined) {
    parsed.inclusions = parseStringList(data.inclusions, "Inclusions", { maxItems: 40, maxLength: 300 });
  }
  if (data.exclusions !== undefined) {
    parsed.exclusions = parseStringList(data.exclusions, "Exclusions", { maxItems: 40, maxLength: 300 });
  }
  if (data.videoTitle !== undefined) {
    parsed.videoTitle = optionalString(data.videoTitle, "Video title", { max: 160 });
  }
  if (data.videoSubtitle !== undefined) {
    parsed.videoSubtitle = optionalString(data.videoSubtitle, "Video subtitle", { max: 120 });
  }
  if (data.videoThumbnail !== undefined) {
    parsed.videoThumbnail = optionalImage(data.videoThumbnail, "Video thumbnail");
  }
  if (data.videoUrl !== undefined) {
    parsed.videoUrl = optionalUrl(data.videoUrl, "Video URL");
  }
  if (data.gallery !== undefined) {
    parsed.gallery = requireArray(data.gallery, "Gallery", { min: 0, max: 20 }).map((image, index) =>
      optionalImage(image, `Gallery image ${index + 1}`)
    );
  }
  if (data.isFeatured !== undefined) {
    parsed.isFeatured = optionalBoolean(data.isFeatured, "isFeatured", true);
  }
  if (data.isActive !== undefined) {
    parsed.isActive = optionalBoolean(data.isActive, "isActive", true);
  }

  return parsed;
};

export const getAllTours = async (req, res, next) => {
  try {
    if (req.query.all === "true" && !req.admin) {
      throw new ApiError(401, "Admin login required to view all tours.");
    }

    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (req.query.featured === "true") filter.isFeatured = true;

    if (req.query.category && req.query.category !== "all") {
      const catClean = String(req.query.category).replace(/-/g, " ").trim().slice(0, 80);
      filter.category = new RegExp(escapeRegex(catClean), "i");
    }

    if (req.query.tourType && req.query.tourType !== "all") {
      const typeClean = String(req.query.tourType).replace(/-/g, " ").trim().slice(0, 40);
      filter.tourType = new RegExp(escapeRegex(typeClean), "i");
    }

    const tours = await Tour.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, count: tours.length, tours });
  } catch (error) {
    next(error);
  }
};

export const getTourCategories = async (req, res, next) => {
  try {
    const themedCategories = await Tour.distinct("category", {
      $or: [{ tourType: /themed/i }, { tourType: /both/i }],
      isActive: true,
    });
    const groupCategories = await Tour.distinct("category", {
      $or: [{ tourType: /group/i }, { tourType: /both/i }],
      isActive: true,
    });
    const allCategories = await Tour.distinct("category", { isActive: true });

    res.json({
      success: true,
      themed: themedCategories.filter(Boolean),
      group: groupCategories.filter(Boolean),
      all: allCategories.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

export const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour || (!tour.isActive && !req.admin)) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }
    res.json({ success: true, tour });
  } catch (error) {
    next(error);
  }
};

export const createTour = async (req, res, next) => {
  try {
    const payload = parseTour(req.body);
    if (!payload.title) throw new ApiError(400, "Tour title required hai.");
    if (payload.price === undefined) throw new ApiError(400, "Tour price required hai.");

    const tour = await Tour.create(payload);
    res.status(201).json({ success: true, tour });
  } catch (error) {
    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const payload = parseTour(req.body);
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });

    tour.set(payload);
    await tour.save();
    res.json({ success: true, tour });
  } catch (error) {
    next(error);
  }
};

export const updateTourGallery = async (req, res, next) => {
  try {
    const { gallery } = req.body;
    const images = requireArray(gallery, "Gallery", { min: 0, max: 20 }).map((image, index) =>
      optionalImage(image, `Gallery image ${index + 1}`)
    );

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { gallery: images },
      { new: true, runValidators: true }
    );
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });

    res.json({ success: true, gallery: tour.gallery, tour });
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: "Tour not found" });
    res.json({ success: true, message: "Tour deleted successfully" });
  } catch (error) {
    next(error);
  }
};
