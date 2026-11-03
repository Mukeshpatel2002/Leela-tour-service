import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    tour: { type: String, required: true, trim: true, maxlength: 160 },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    review: { type: String, required: true, trim: true, maxlength: 3000 },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating whole number (1-5) honi chahiye.",
      },
    },
    photo: { type: String, default: "", maxlength: 4_000_000 },
    userEmail: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    userPhone: { type: String, default: "", trim: true, maxlength: 20 },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ isActive: 1, isApproved: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);
