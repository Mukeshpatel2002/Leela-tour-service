import Content from "../models/Content.js";
import { ApiError } from "../utils/ApiError.js";
import {
  isPlainObject,
  optionalEmail,
  optionalImage,
  optionalString,
  optionalUrl,
  pickFields,
  requireArray,
} from "../utils/validation.js";

const getContentDoc = async () => {
  let content = await Content.findOne();
  if (!content) content = await Content.create({});
  return content;
};

const parseStats = (value, field) =>
  requireArray(value, field, { min: 1, max: 6 }).map((item, index) => {
    if (!isPlainObject(item)) throw new ApiError(400, `${field} item ${index + 1} invalid hai.`);
    return {
      number: optionalString(item.number, `${field} number`, { max: 20 }),
      label: optionalString(item.label, `${field} label`, { max: 40 }),
    };
  });

const parseHero = (value, prefix = "Hero") => {
  if (!isPlainObject(value)) throw new ApiError(400, `${prefix} section object hona chahiye.`);
  const data = pickFields(value, ["image", "title", "subtitle", "badge", "stats"]);
  const parsed = {};
  if (data.image !== undefined) parsed.image = optionalImage(data.image, `${prefix} image`);
  if (data.title !== undefined) parsed.title = optionalString(data.title, `${prefix} title`, { max: 160 });
  if (data.subtitle !== undefined) {
    parsed.subtitle = optionalString(data.subtitle, `${prefix} subtitle`, { max: 500 });
  }
  if (data.badge !== undefined) parsed.badge = optionalString(data.badge, `${prefix} badge`, { max: 80 });
  if (data.stats !== undefined) parsed.stats = parseStats(data.stats, `${prefix} stats`);
  return parsed;
};

const parseOffer = (value) => {
  if (!isPlainObject(value)) throw new ApiError(400, "Offer section object hona chahiye.");
  const data = pickFields(value, ["tag", "title", "subtitle", "ctaText"]);
  const parsed = {};
  if (data.tag !== undefined) parsed.tag = optionalString(data.tag, "Offer tag", { max: 80 });
  if (data.title !== undefined) parsed.title = optionalString(data.title, "Offer title", { max: 160 });
  if (data.subtitle !== undefined) {
    parsed.subtitle = optionalString(data.subtitle, "Offer subtitle", { max: 500 });
  }
  if (data.ctaText !== undefined) {
    parsed.ctaText = optionalString(data.ctaText, "Offer button text", { max: 60 });
  }
  return parsed;
};

const parseWhyUs = (value) => {
  if (!isPlainObject(value)) throw new ApiError(400, "Why Us section object hona chahiye.");
  const data = pickFields(value, ["tag", "title", "subtitle", "statsNumber", "statsLabel"]);
  const parsed = {};
  if (data.tag !== undefined) parsed.tag = optionalString(data.tag, "Why Us tag", { max: 80 });
  if (data.title !== undefined) parsed.title = optionalString(data.title, "Why Us title", { max: 160 });
  if (data.subtitle !== undefined) {
    parsed.subtitle = optionalString(data.subtitle, "Why Us subtitle", { max: 500 });
  }
  if (data.statsNumber !== undefined) {
    parsed.statsNumber = optionalString(data.statsNumber, "Why Us stats number", { max: 40 });
  }
  if (data.statsLabel !== undefined) {
    parsed.statsLabel = optionalString(data.statsLabel, "Why Us stats label", { max: 60 });
  }
  return parsed;
};

const parseContact = (value) => {
  if (!isPlainObject(value)) throw new ApiError(400, "Contact section object hona chahiye.");
  const data = pickFields(value, [
    "phone",
    "email",
    "corporateOffice",
    "quickContact",
    "whatsapp",
    "facebook",
    "instagram",
  ]);
  const parsed = {};

  if (data.phone !== undefined) parsed.phone = optionalString(data.phone, "Contact phone", { max: 30 });
  if (data.email !== undefined) parsed.email = optionalEmail(data.email, "Contact email");
  if (data.corporateOffice !== undefined) {
    parsed.corporateOffice = optionalString(data.corporateOffice, "Corporate office", { max: 500 });
  }
  if (data.quickContact !== undefined) {
    parsed.quickContact = optionalString(data.quickContact, "Quick contact", { max: 200 });
  }
  if (data.whatsapp !== undefined) {
    const raw = optionalString(data.whatsapp, "WhatsApp number", { max: 20 });
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      throw new ApiError(400, "WhatsApp number 10 se 15 digits ka hona chahiye.");
    }
    parsed.whatsapp = digits;
  }
  if (data.facebook !== undefined) {
    parsed.facebook = optionalUrl(data.facebook, "Facebook URL");
  }
  if (data.instagram !== undefined) {
    parsed.instagram = optionalUrl(data.instagram, "Instagram URL");
  }
  return parsed;
};

const parseFooter = (value) => {
  if (!isPlainObject(value)) throw new ApiError(400, "Footer section object hona chahiye.");
  const data = pickFields(value, ["aboutText", "phone", "email", "address"]);
  const parsed = {};
  if (data.aboutText !== undefined) {
    parsed.aboutText = optionalString(data.aboutText, "Footer about text", { max: 1000 });
  }
  if (data.phone !== undefined) parsed.phone = optionalString(data.phone, "Footer phone", { max: 30 });
  if (data.email !== undefined) parsed.email = optionalEmail(data.email, "Footer email");
  if (data.address !== undefined) {
    parsed.address = optionalString(data.address, "Footer address", { max: 200 });
  }
  return parsed;
};

const isObject = isPlainObject;

export const getContent = async (req, res, next) => {
  try {
    const content = await getContentDoc();
    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const body = req.body;
    if (!isObject(body)) throw new ApiError(400, "Request body valid JSON object hona chahiye.");

    const content = await getContentDoc();
    let updated = false;

    const mergeSection = (section, parsed) => {
      const current =
        typeof content[section]?.toObject === "function"
          ? content[section].toObject()
          : content[section] || {};
      content.set(section, { ...current, ...parsed });
      updated = true;
    };

    if (body.hero !== undefined) mergeSection("hero", parseHero(body.hero, "Hero"));
    if (body.themedHero !== undefined) {
      mergeSection("themedHero", parseHero(body.themedHero, "Themed hero"));
    }
    if (body.groupHero !== undefined) {
      mergeSection("groupHero", parseHero(body.groupHero, "Group hero"));
    }
    if (body.offer !== undefined) mergeSection("offer", parseOffer(body.offer));
    if (body.whyUs !== undefined) mergeSection("whyUs", parseWhyUs(body.whyUs));
    if (body.contact !== undefined) mergeSection("contact", parseContact(body.contact));
    if (body.footer !== undefined) mergeSection("footer", parseFooter(body.footer));

    if (!updated) throw new ApiError(400, "Update ke liye koi valid content section nahi mila.");

    await content.save();
    res.json({ success: true, message: "Content updated successfully", content });
  } catch (error) {
    next(error);
  }
};
