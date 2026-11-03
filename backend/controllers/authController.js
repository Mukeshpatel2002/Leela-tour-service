import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { ApiError } from "../utils/ApiError.js";
import { requireEmail, requirePassword, requireString, optionalString } from "../utils/validation.js";

const isProduction = process.env.NODE_ENV === "production";

const signToken = (admin) => {
  return jwt.sign({ id: admin._id, v: admin.tokenVersion || 0 }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const publicAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
});

const getClientUrl = () => (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const email = requireEmail(req.body?.email, "Email");
    const password = requirePassword(req.body?.password, "Password", { min: 1 });

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      token: signToken(admin),
      admin: publicAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  res.json({ success: true, admin: publicAdmin(req.admin) });
};

// @desc    Update Admin profile (Name, Email)
// @route   PUT /api/auth/update-profile
// @access  Private (Admin)
export const updateAdminProfile = async (req, res, next) => {
  try {
    const email = requireEmail(req.body?.email, "Admin email");
    const name = optionalString(req.body?.name, "Name", { max: 80, fallback: req.admin.name });

    const existing = await Admin.findOne({ email, _id: { $ne: req.admin._id } });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email address is already in use by another admin.",
      });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    admin.email = email;
    admin.name = name || admin.name;
    await admin.save();

    res.json({
      success: true,
      message: "Admin profile updated successfully!",
      token: signToken(admin),
      admin: publicAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Admin password
// @route   PUT /api/auth/change-password
// @access  Private (Admin)
export const changeAdminPassword = async (req, res, next) => {
  try {
    const currentPassword = requirePassword(req.body?.currentPassword, "Current password", {
      min: 1,
    });
    const newPassword = requirePassword(req.body?.newPassword, "New password");

    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password does not match." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password purane password se alag hona chahiye.",
      });
    }

    admin.password = newPassword;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();

    res.json({
      success: true,
      message: "Password updated successfully! Other devices will need to login again.",
      token: signToken(admin),
      admin: publicAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (invalidate every issued token)
// @route   POST /api/auth/logout
// @access  Private (Admin)
export const adminLogout = async (req, res, next) => {
  try {
    await Admin.updateOne({ _id: req.admin._id }, { $inc: { tokenVersion: 1 } });
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send Reset Link to Email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const email = requireEmail(req.body?.email, "Email");
    const genericMessage =
      "Agar ye email registered hai to password reset link bhej diya gaya hai. Apna inbox check karein.";

    const admin = await Admin.findOne({ email });

    // Same response for unknown emails so accounts cannot be enumerated.
    if (!admin) {
      return res.json({ success: true, message: genericMessage });
    }

    const resetToken = admin.getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${getClientUrl()}/admin/reset-password/${resetToken}`;

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #07569b; margin: 0; font-size: 24px;">Leela Tours & Travels</h2>
          <p style="color: #ff6500; font-weight: bold; margin: 4px 0 0 0;">Admin Security Portal</p>
        </div>
        
        <h3 style="color: #1e293b; font-size: 18px; margin-top: 20px;">Password Reset Request</h3>
        <p style="color: #475569; line-height: 1.6; font-size: 14px;">
          Hello <strong>${admin.name || "Admin"}</strong>,
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 14px;">
          We received a request to reset the password for your Leela Tours Admin account (<strong>${admin.email}</strong>).
        </p>
        <p style="color: #475569; line-height: 1.6; font-size: 14px;">
          Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #ff6500; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(255,101,0,0.3);">
            Reset Password Now
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          If the button doesn't work, copy and paste this URL into your browser:<br/>
          <a href="${resetUrl}" style="color: #07569b; word-break: break-all;">${resetUrl}</a>
        </p>
        
        <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; color: #94a3b8; font-size: 12px;">
          If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: admin.email,
        subject: "Leela Tours Admin - Password Reset Link",
        text: `You requested a password reset for your Leela Tours admin account. Reset your password here: ${resetUrl} (Valid for 15 minutes).`,
        html: messageHtml,
      });

      res.json({
        success: true,
        message: genericMessage,
        // Dev convenience only - reset links must never be exposed in production.
        ...(isProduction ? {} : { resetUrl }),
      });
    } catch (err) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: "Reset email bhejne me problem aayi. Thodi der baad try karein.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password via Token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const password = requirePassword(req.body?.password, "New password");
    const token = requireString(req.params?.token, "Reset token", { min: 10, max: 200 });

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      throw new ApiError(
        400,
        "Invalid or expired password reset link. Please request a new one."
      );
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();

    res.json({
      success: true,
      message: "Password reset successfully! You are now logged in.",
      token: signToken(admin),
      admin: publicAdmin(admin),
    });
  } catch (error) {
    next(error);
  }
};
