import Review from "../models/Review.js";
import { isAdminRequest } from "../middleware/optionalAdmin.js";
import {
  requireString,
  optionalEmail,
  optionalPhone,
  optionalImage,
  optionalNumber,
  optionalBoolean,
} from "../utils/validation.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Contact details are for the admin only. GET /api/reviews is a public route, so
// the anonymous branch must not carry them back.
const PUBLIC_REVIEW_FIELDS = "-userEmail -userPhone -__v";

const parseReview = (body = {}, { partial = false } = {}) => {
  const payload = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has("name")) {
    payload.name = requireString(body.name, "Name", { max: 80 });
  }
  if (!partial || has("tour")) {
    payload.tour = requireString(body.tour, "Tour name", { max: 160 });
  }
  if (!partial || has("review")) {
    payload.review = requireString(body.review, "Review", { max: 3000 });
  }
  if (!partial || has("rating")) {
    payload.rating = optionalNumber(body.rating, "Rating", {
      min: 1,
      max: 5,
      integer: true,
      fallback: 5,
    });
  }
  if (!partial || has("photo")) {
    payload.photo = optionalImage(body.photo, "Photo", { fallback: "" });
  }
  if (!partial || has("userEmail")) {
    payload.userEmail = optionalEmail(body.userEmail, "Email");
  }
  if (!partial || has("userPhone")) {
    payload.userPhone = optionalPhone(body.userPhone, "Phone");
  }
  if (!partial || has("isApproved")) {
    payload.isApproved = optionalBoolean(body.isApproved, "isApproved", true);
  }
  if (!partial || has("isActive")) {
    payload.isActive = optionalBoolean(body.isActive, "isActive", true);
  }
  if (has("tourId")) {
    payload.tourId = body.tourId || null;
  }

  return payload;
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public (only approved & active by default, all for admin)
export const getAllReviews = async (req, res, next) => {
  try {
    const filter = {};
    const isAdmin = isAdminRequest(req);

    if (!isAdmin) {
      filter.isActive = true;
      filter.isApproved = { $ne: false };
    } else if (req.query.status === "pending") {
      filter.isApproved = false;
    } else if (req.query.status === "approved") {
      filter.isApproved = true;
    }

    if (req.query.tour) {
      filter.tour = new RegExp(escapeRegex(String(req.query.tour).trim()), "i");
    }

    let query = Review.find(filter).sort({ createdAt: -1 }).limit(500);
    if (!isAdmin) query = query.select(PUBLIC_REVIEW_FIELDS);

    const reviews = await query;
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Public Tourist Review Submission
// @route   POST /api/reviews/submit
// @access  Public
export const submitPublicReview = async (req, res, next) => {
  try {
    const payload = parseReview(req.body, { partial: true });

    const newReview = await Review.create({
      ...payload,
      isApproved: false,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted and is waiting for approval.",
      review: {
        _id: newReview._id,
        name: newReview.name,
        tour: newReview.tour,
        rating: newReview.rating,
        isApproved: newReview.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Approve Review
// @route   PUT /api/reviews/:id/approve
// @access  Private (Admin)
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isActive: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review approved successfully!", review });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review (Admin manual add)
// @route   POST /api/reviews
// @access  Private (Admin)
export const createReview = async (req, res, next) => {
  try {
    const payload = parseReview(req.body, { partial: true });
    const review = await Review.create(payload);
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const payload = parseReview(req.body, { partial: true });
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) review.set(key, value);
    });

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
