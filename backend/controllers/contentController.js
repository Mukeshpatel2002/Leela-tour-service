import Content from "../models/Content.js";
import { ApiError } from "../utils/ApiError.js";
import {
  enumValue,
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

const ABOUT_ICONS = [
  "diamond",
  "bus",
  "guide",
  "clock",
  "smile",
  "shield",
  "heart",
  "users",
  "phone",
  "map",
  "star",
];

const asSection = (value, label) => {
  if (!isPlainObject(value)) throw new ApiError(400, `${label} section object hona chahiye.`);
  return value;
};

const parseAbout = (value) => {
  const about = asSection(value, "About");
  const parsed = {};

  if (about.banner !== undefined) {
    parsed.banner = parseHero(about.banner, "About banner");
  }

  if (about.intro !== undefined) {
    const data = pickFields(asSection(about.intro, "About intro"), [
      "tag",
      "title",
      "text",
      "ctaText",
      "stats",
      "images",
    ]);
    const out = {};
    if (data.tag !== undefined) out.tag = optionalString(data.tag, "About intro tag", { max: 80 });
    if (data.title !== undefined) {
      out.title = optionalString(data.title, "About intro title", { max: 160 });
    }
    if (data.text !== undefined) out.text = optionalString(data.text, "About intro text", { max: 2000 });
    if (data.ctaText !== undefined) {
      out.ctaText = optionalString(data.ctaText, "About intro button", { max: 60 });
    }
    if (data.stats !== undefined) out.stats = parseStats(data.stats, "About intro stats");
    if (data.images !== undefined) {
      out.images = requireArray(data.images, "About photos", { min: 1, max: 3 }).map((image, index) =>
        optionalImage(image, `About photo ${index + 1}`, { max: 3_000_000 })
      );
    }
    parsed.intro = out;
  }

  if (about.story !== undefined) {
    const data = pickFields(asSection(about.story, "About story"), [
      "tag",
      "title",
      "text1",
      "text2",
      "image",
      "trustPoints",
    ]);
    const out = {};
    if (data.tag !== undefined) out.tag = optionalString(data.tag, "About story tag", { max: 80 });
    if (data.title !== undefined) {
      out.title = optionalString(data.title, "About story title", { max: 160 });
    }
    if (data.text1 !== undefined) {
      out.text1 = optionalString(data.text1, "About story text", { max: 2000 });
    }
    if (data.text2 !== undefined) {
      out.text2 = optionalString(data.text2, "About story text 2", { max: 2000 });
    }
    if (data.image !== undefined) out.image = optionalImage(data.image, "About story image");
    if (data.trustPoints !== undefined) {
      out.trustPoints = requireArray(data.trustPoints, "About trust points", { min: 1, max: 6 }).map(
        (item, index) => {
          if (!isPlainObject(item)) {
            throw new ApiError(400, `About trust point ${index + 1} invalid hai.`);
          }
          return {
            title: optionalString(item.title, `About trust point ${index + 1}`, { max: 80 }),
          };
        }
      );
    }
    parsed.story = out;
  }

  if (about.why !== undefined) {
    const data = pickFields(asSection(about.why, "About why us"), ["tag", "title", "items"]);
    const out = {};
    if (data.tag !== undefined) out.tag = optionalString(data.tag, "About why tag", { max: 80 });
    if (data.title !== undefined) out.title = optionalString(data.title, "About why title", { max: 160 });
    if (data.items !== undefined) {
      out.items = requireArray(data.items, "About reasons", { min: 1, max: 8 }).map((item, index) => {
        if (!isPlainObject(item)) throw new ApiError(400, `About reason ${index + 1} invalid hai.`);
        return {
          title: optionalString(item.title, `About reason ${index + 1} title`, { max: 80 }),
          description: optionalString(item.description, `About reason ${index + 1} detail`, {
            max: 200,
          }),
          icon: enumValue(item.icon, `About reason ${index + 1} icon`, ABOUT_ICONS, "star"),
        };
      });
    }
    parsed.why = out;
  }

  if (about.team !== undefined) {
    const data = pickFields(asSection(about.team, "About team"), [
      "tag",
      "title",
      "text",
      "ctaText",
      "members",
    ]);
    const out = {};
    if (data.tag !== undefined) out.tag = optionalString(data.tag, "About team tag", { max: 80 });
    if (data.title !== undefined) out.title = optionalString(data.title, "About team title", { max: 160 });
    if (data.text !== undefined) out.text = optionalString(data.text, "About team text", { max: 1000 });
    if (data.ctaText !== undefined) {
      out.ctaText = optionalString(data.ctaText, "About team button", { max: 60 });
    }
    if (data.members !== undefined) {
      out.members = requireArray(data.members, "About team members", { min: 1, max: 8 }).map(
        (item, index) => {
          if (!isPlainObject(item)) throw new ApiError(400, `Team member ${index + 1} invalid hai.`);
          return {
            name: optionalString(item.name, `Team member ${index + 1} name`, { max: 60 }),
            role: optionalString(item.role, `Team member ${index + 1} role`, { max: 60 }),
            photo: optionalImage(item.photo, `Team member ${index + 1} photo`, {
              max: 3_000_000,
            }),
          };
        }
      );
    }
    parsed.team = out;
  }

  if (about.testimonials !== undefined) {
    const data = pickFields(asSection(about.testimonials, "About testimonials"), ["tag", "title"]);
    const out = {};
    if (data.tag !== undefined) out.tag = optionalString(data.tag, "Testimonials tag", { max: 80 });
    if (data.title !== undefined) {
      out.title = optionalString(data.title, "Testimonials title", { max: 160 });
    }
    parsed.testimonials = out;
  }

  if (about.cta !== undefined) {
    const data = pickFields(asSection(about.cta, "About CTA"), ["title", "subtitle", "buttonText"]);
    const out = {};
    if (data.title !== undefined) out.title = optionalString(data.title, "About CTA title", { max: 160 });
    if (data.subtitle !== undefined) {
      out.subtitle = optionalString(data.subtitle, "About CTA subtitle", { max: 300 });
    }
    if (data.buttonText !== undefined) {
      out.buttonText = optionalString(data.buttonText, "About CTA button", { max: 60 });
    }
    parsed.cta = out;
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

// Banners and photos are stored inline as base64 on this single document, and
// MongoDB refuses anything over 16MB. Check before saving so the admin gets a
// clear 400 instead of a driver error.
const CONTENT_IMAGE_BUDGET = 12_000_000;

const inlineImageBytes = (node) => {
  if (typeof node === "string") return node.startsWith("data:image") ? node.length : 0;
  if (Array.isArray(node)) return node.reduce((sum, item) => sum + inlineImageBytes(item), 0);
  if (isPlainObject(node)) {
    return Object.values(node).reduce((sum, value) => sum + inlineImageBytes(value), 0);
  }
  return 0;
};

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
    if (body.about !== undefined) mergeSection("about", parseAbout(body.about));
    if (body.contact !== undefined) mergeSection("contact", parseContact(body.contact));
    if (body.footer !== undefined) mergeSection("footer", parseFooter(body.footer));

    if (!updated) throw new ApiError(400, "Update ke liye koi valid content section nahi mila.");

    const imageBytes = inlineImageBytes(content.toObject());
    if (imageBytes > CONTENT_IMAGE_BUDGET) {
      throw new ApiError(
        400,
        `Site ki total images bahut badi hain (${(imageBytes / 1048576).toFixed(
          1
        )} MB, limit 12 MB). Chhoti images upload karein.`
      );
    }

    await content.save();
    res.json({ success: true, message: "Content updated successfully", content });
  } catch (error) {
    next(error);
  }
};
