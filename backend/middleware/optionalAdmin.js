import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Attaches req.admin when a valid admin token is provided.
// Never rejects on its own - routes decide what to do without an admin.
export const optionalAdmin = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    const admin = await Admin.findById(decoded.id).select("-password");

    if (admin && (decoded.v || 0) === (admin.tokenVersion || 0)) {
      req.admin = admin;
    }
  } catch {
    // Invalid/expired token on an optional route is treated as anonymous.
  }

  next();
};

export const isAdminRequest = (req) => Boolean(req.admin);
