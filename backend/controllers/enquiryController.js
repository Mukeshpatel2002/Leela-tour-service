import Enquiry from "../models/Enquiry.js";
import {
  requireString,
  optionalString,
  optionalEmail,
  optionalPhone,
  optionalNumber,
  enumValue,
} from "../utils/validation.js";

const ENQUIRY_SOURCES = ["contact_page", "whatsapp_click", "tour_booking"];
const ENQUIRY_STATUSES = ["new", "contacted", "converted", "closed"];

// @desc    Create new customer enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res, next) => {
  try {
    const body = req.body || {};

    const enquiry = await Enquiry.create({
      name: requireString(body.name, "Name", { max: 80 }),
      email: optionalEmail(body.email, "Email"),
      phone: optionalPhone(body.phone, "Phone"),
      tourTitle: optionalString(body.tourTitle, "Tour title", { max: 160, fallback: "" }),
      departureDate: optionalString(body.departureDate, "Departure date", {
        max: 60,
        fallback: "",
      }),
      travellers: optionalNumber(body.travellers, "Travellers", {
        min: 0,
        max: 60,
        integer: true,
        fallback: 1,
      }),
      estimatedTotal: optionalNumber(body.estimatedTotal, "Estimated total", {
        min: 0,
        max: 100_000_000,
        fallback: 0,
      }),
      message: optionalString(body.message, "Message", { max: 2000, fallback: "" }),
      source: enumValue(body.source, "Source", ENQUIRY_SOURCES, "contact_page"),
      // Status is always "new" on creation; admins manage it later.
    });

    res.status(201).json({ success: true, message: "Enquiry submitted successfully", enquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
export const getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(1000);
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const status = enumValue(req.body?.status, "Status", ENQUIRY_STATUSES);

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({ success: true, enquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
