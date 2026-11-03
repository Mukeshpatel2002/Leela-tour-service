import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 20 },
    tourTitle: { type: String, default: "", trim: true, maxlength: 160 },
    departureDate: { type: String, default: "", trim: true, maxlength: 60 },
    travellers: { type: Number, default: 1, min: 0, max: 60 },
    estimatedTotal: { type: Number, default: 0, min: 0, max: 100_000_000 },
    message: { type: String, default: "", trim: true, maxlength: 2000 },
    source: {
      type: String,
      default: "contact_page",
      enum: ["contact_page", "whatsapp_click", "tour_booking"],
    },
    status: {
      type: String,
      default: "new",
      enum: ["new", "contacted", "converted", "closed"],
    },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Enquiry", enquirySchema);
