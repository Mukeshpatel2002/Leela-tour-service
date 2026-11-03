import { rateLimit } from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

const message = (text) => ({ success: false, message: text });

// Broad protection for every API route.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Bahut zyada requests bheji gayi hain. Thodi der baad try karein."),
});

// Login / password-reset confirmation attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 15 : 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: message("Too many attempts. Please try again after 15 minutes."),
});

// "Email me a reset link" requests. This endpoint answers 200 even for unknown
// emails, so skipSuccessfulRequests would never count anything and would leave
// SMTP quota open to abuse.
export const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 5 : 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Bahut zyada reset requests. Thodi der baad try karein."),
});

// Public form submissions (enquiries, reviews).
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: isProduction ? 20 : 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: message("Bahut zyada form submissions. Thodi der baad try karein."),
});
