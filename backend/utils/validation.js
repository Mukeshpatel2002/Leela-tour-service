import { ApiError } from "./ApiError.js";

export const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const pickFields = (source, keys) => {
  const picked = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      picked[key] = source[key];
    }
  });
  return picked;
};

export const requireString = (value, field, { min = 1, max = 500 } = {}) => {
  if (typeof value !== "string") throw new ApiError(400, `${field} text hona chahiye.`);
  const text = value.trim();
  if (text.length < min) {
    throw new ApiError(400, `${field} kam se kam ${min} characters ka hona chahiye.`);
  }
  if (text.length > max) {
    throw new ApiError(400, `${field} ${max} characters se zyada nahi ho sakta.`);
  }
  return text;
};

export const optionalString = (value, field, { max = 500, fallback = "" } = {}) => {
  if (value === undefined || value === null || value === "") return fallback;
  return requireString(value, field, { min: 0, max });
};

export const requireNumber = (
  value,
  field,
  { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, integer = false } = {}
) => {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new ApiError(400, `${field} valid number hona chahiye.`);
  if (integer && !Number.isInteger(num)) {
    throw new ApiError(400, `${field} whole number hona chahiye.`);
  }
  if (num < min || num > max) {
    throw new ApiError(400, `${field} ${min} se ${max} ke beech hona chahiye.`);
  }
  return num;
};

export const optionalNumber = (
  value,
  field,
  { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, integer = false, fallback = 0 } = {}
) => {
  if (value === undefined || value === null || value === "") return fallback;
  return requireNumber(value, field, { min, max, integer });
};

export const optionalBoolean = (value, field, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "boolean") throw new ApiError(400, `${field} true ya false hona chahiye.`);
  return value;
};

export const enumValue = (value, field, allowed, fallback) => {
  if (value === undefined || value === null || value === "") {
    if (fallback !== undefined) return fallback;
    throw new ApiError(400, `${field} required hai.`);
  }
  if (!allowed.includes(value)) {
    throw new ApiError(400, `${field} in values me se ek hona chahiye: ${allowed.join(", ")}.`);
  }
  return value;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export const requireEmail = (value, field = "Email") => {
  const email = requireString(value, field, { min: 3, max: 254 }).toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, `${field} valid email address hona chahiye.`);
  }
  return email;
};

export const optionalEmail = (value, field = "Email") => {
  if (value === undefined || value === null || value === "") return "";
  return requireEmail(value, field);
};

export const requirePhone = (value, field = "Phone") => {
  const phone = requireString(value, field, { min: 7, max: 20 });
  if (!PHONE_REGEX.test(phone)) {
    throw new ApiError(400, `${field} valid phone number hona chahiye.`);
  }
  return phone;
};

export const optionalPhone = (value, field = "Phone") => {
  if (value === undefined || value === null || value === "") return "";
  return requirePhone(value, field);
};

export const requirePassword = (value, field = "Password", { min = 8, max = 72 } = {}) => {
  if (typeof value !== "string") throw new ApiError(400, `${field} required hai.`);
  if (value.length < min) {
    throw new ApiError(400, `${field} kam se kam ${min} characters ka hona chahiye.`);
  }
  if (value.length > max) {
    throw new ApiError(400, `${field} ${max} characters se zyada nahi ho sakta.`);
  }
  return value;
};

export const optionalUrl = (value, field = "URL", { fallback = "" } = {}) => {
  if (value === undefined || value === null || value === "") return fallback;
  const url = requireString(value, field, { min: 0, max: 500 });
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new ApiError(400, `${field} valid URL hona chahiye (http:// ya https://).`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new ApiError(400, `${field} me sirf http ya https URL allowed hai.`);
  }
  return url;
};

const DATA_IMAGE_REGEX = /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i;

export const optionalImage = (value, field = "Image", { fallback = "", max = 8_000_000 } = {}) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") {
    throw new ApiError(400, `${field} valid image path ya URL hona chahiye.`);
  }
  const image = value.trim();
  if (image.length > max) {
    throw new ApiError(400, `${field} bahut bada hai. Chhoti image upload karein.`);
  }
  if (DATA_IMAGE_REGEX.test(image)) return image;
  if (/^https?:\/\//i.test(image)) {
    try {
      new URL(image);
      return image;
    } catch {
      throw new ApiError(400, `${field} valid URL nahi hai.`);
    }
  }
  if (image.startsWith("/")) return image;
  throw new ApiError(400, `${field} valid image URL, path ya uploaded image hona chahiye.`);
};

export const requireArray = (value, field = "List", { min = 0, max = 50 } = {}) => {
  if (!Array.isArray(value)) throw new ApiError(400, `${field} list (array) hona chahiye.`);
  if (value.length < min || value.length > max) {
    throw new ApiError(400, `${field} me ${min} se ${max} items hone chahiye.`);
  }
  return value;
};


