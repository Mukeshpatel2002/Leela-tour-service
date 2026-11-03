import Faq from "../models/Faq.js";
import { isAdminRequest } from "../middleware/optionalAdmin.js";
import {
  requireString,
  optionalNumber,
  optionalBoolean,
} from "../utils/validation.js";

const parseFaq = (body = {}, { partial = false } = {}) => {
  const payload = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has("question")) {
    payload.question = requireString(body.question, "Question", { max: 200 });
  }
  if (!partial || has("answer")) {
    payload.answer = requireString(body.answer, "Answer", { max: 2000 });
  }
  if (!partial || has("order")) {
    payload.order = optionalNumber(body.order, "Order", { min: 0, max: 999, integer: true, fallback: 0 });
  }
  if (!partial || has("isActive")) {
    payload.isActive = optionalBoolean(body.isActive, "isActive", true);
  }

  return payload;
};

// @desc    Get all faqs
// @route   GET /api/faqs
// @access  Public
export const getAllFaqs = async (req, res, next) => {
  try {
    const filter = isAdminRequest(req) ? {} : { isActive: true };
    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: 1 }).limit(200);
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private (Admin)
export const createFaq = async (req, res, next) => {
  try {
    const faq = await Faq.create(parseFaq(req.body));
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
export const updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    const payload = parseFaq(req.body, { partial: true });
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) faq.set(key, value);
    });

    await faq.save();
    res.json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
export const deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    res.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};
