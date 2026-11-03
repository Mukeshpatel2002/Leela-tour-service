import React, { useEffect, useState, useRef } from "react";
import { getContent, updateContent } from "../../api/api";
import { toast } from "react-hot-toast";
import { FaSave, FaImage, FaUpload, FaTrash } from "react-icons/fa";

// Client-side image compression for banner uploads
const compressImage = (file, maxWidth = 1600, maxHeight = 900, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ManageContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero"); // hero | themedHero | groupHero | offer | contact | footer

  // File input refs for each banner
  const homeFileRef = useRef(null);
  const themedFileRef = useRef(null);
  const groupFileRef = useRef(null);

  const ensureBannerDefaults = (data) => {
    return {
      ...data,
      hero: {
        image: data?.hero?.image || "",
        title: data?.hero?.title || "Get your trip price in 2 minutes",
        subtitle:
          data?.hero?.subtitle ||
          "Tell us a little and we'll send the best price on WhatsApp. Free, no obligation.",
        stats:
          data?.hero?.stats?.length === 4
            ? data.hero.stats
            : [
                { number: "500+", label: "Happy Travellers" },
                { number: "40+", label: "Tour Packages" },
                { number: "20+", label: "Destinations" },
                { number: "10+", label: "Years of Experience" },
              ],
      },
      themedHero: {
        image:
          data?.themedHero?.image ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        title: data?.themedHero?.title || "Themed Tours",
        subtitle:
          data?.themedHero?.subtitle ||
          "Handpicked journeys planned around who you travel with — romance, culture, adventure and spirituality.",
        badge: data?.themedHero?.badge || "Curated Themed Experiences",
        stats:
          data?.themedHero?.stats?.length === 4
            ? data.themedHero.stats
            : [
                { number: "1,200+", label: "Happy Explorers" },
                { number: "35+", label: "Curated Itineraries" },
                { number: "15+", label: "Unique Themes" },
                { number: "10+", label: "Years of Trust" },
              ],
      },
      groupHero: {
        image: data?.groupHero?.image || "",
        title: data?.groupHero?.title || "Group Tours",
        subtitle:
          data?.groupHero?.subtitle ||
          "Fixed departures, verified itineraries, friendly small groups and memories for a lifetime.",
        badge: data?.groupHero?.badge || "Small Group Departures",
        stats:
          data?.groupHero?.stats?.length === 4
            ? data.groupHero.stats
            : [
                { number: "500+", label: "Happy Group Travellers" },
                { number: "50+", label: "Group Trips" },
                { number: "20+", label: "Destinations" },
                { number: "10+", label: "Years of Experience" },
              ],
      },
    };
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await getContent();
        if (res.data?.success) {
          setContent(ensureBannerDefaults(res.data.content));
        }
      } catch (err) {
        toast.error("Failed to load site content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleBannerUpload = async (sectionKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Compressing and uploading image...", { id: "upload-banner" });
      const base64 = await compressImage(file);
      setContent((prev) => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          image: base64,
        },
      }));
      toast.success("Banner image loaded! Click Save to apply.", { id: "upload-banner" });
    } catch (err) {
      toast.error("Failed to process image.", { id: "upload-banner" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContent(content);
      toast.success("Site content & banners updated successfully!");
    } catch (err) {
      toast.error("Failed to update site content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
      </div>
    );
  }

  // Render a banner section editor helper
  const renderBannerEditor = (sectionKey, titleLabel, defaultPlaceholderImage, showBadge = false) => {
    const currentData = content[sectionKey] || {};
    const fileInputRef =
      sectionKey === "hero"
        ? homeFileRef
        : sectionKey === "themedHero"
        ? themedFileRef
        : groupFileRef;

    return (
      <div className="space-y-6">
        {/* Banner Image Customizer */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FaImage className="text-[#07569b]" />
                <span>{titleLabel} - Background Banner Image</span>
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Upload a scenic photo from your device or paste an image URL.
              </p>
            </div>
          </div>

          {/* Image Preview & Upload Buttons */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative w-full md:w-72 h-36 rounded-xl overflow-hidden border border-gray-300 bg-gray-200 shrink-0 shadow-xs">
              <img
                src={currentData.image || defaultPlaceholderImage}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultPlaceholderImage;
                }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                  {currentData.image ? "Active Banner" : "Default Banner"}
                </span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-gray-700 font-semibold text-[11px] mb-1">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentData.image || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        [sectionKey]: { ...currentData, image: e.target.value },
                      })
                    }
                    placeholder="https://images.unsplash.com/... or paste image link"
                    className="h-10 flex-1 rounded-xl border border-gray-300 px-3 text-xs focus:border-blue-500 bg-white"
                  />
                  {currentData.image && (
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          [sectionKey]: { ...currentData, image: "" },
                        })
                      }
                      title="Clear image (revert to default)"
                      className="px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <FaTrash className="text-xs" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleBannerUpload(sectionKey, e)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#07569b] hover:bg-blue-800 text-white px-4 py-2 text-xs font-bold transition shadow cursor-pointer"
                >
                  <FaUpload />
                  <span>Upload Image from Device</span>
                </button>
                <span className="ml-3 text-[11px] text-gray-500">
                  Recommended size: 1600 x 600 or higher (JPG/PNG)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={showBadge ? "" : "md:col-span-2"}>
            <label className="block font-semibold text-gray-700 mb-1">
              Banner Heading / Title
            </label>
            <input
              type="text"
              value={currentData.title || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  [sectionKey]: { ...currentData, title: e.target.value },
                })
              }
              className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 bg-white"
            />
          </div>

          {showBadge && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Badge Pill Tag
              </label>
              <input
                type="text"
                value={currentData.badge || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    [sectionKey]: { ...currentData, badge: e.target.value },
                  })
                }
                placeholder="e.g. Small Group Departures"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 bg-white"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Banner Subtitle / Description
            </label>
            <textarea
              rows="2"
              value={currentData.subtitle || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  [sectionKey]: { ...currentData, subtitle: e.target.value },
                })
              }
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* 4 Statistics Badges */}
        <div className="border-t border-gray-200 pt-5">
          <div className="mb-3">
            <h3 className="font-bold text-gray-800 text-sm">
              Floating Statistics Pill (4 Badges)
            </h3>
            <p className="text-gray-500 text-[11px]">
              These 4 statistics appear inside the floating white pill card at the bottom of the banner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {currentData.stats?.map((st, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                <label className="block text-gray-500 text-[11px] font-semibold mb-1">
                  Stat {i + 1} Number (Orange)
                </label>
                <input
                  type="text"
                  value={st.number}
                  onChange={(e) => {
                    const updated = [...currentData.stats];
                    updated[i].number = e.target.value;
                    setContent({
                      ...content,
                      [sectionKey]: { ...currentData, stats: updated },
                    });
                  }}
                  className="h-8 w-full rounded-lg border border-gray-300 px-2 text-xs bg-white font-bold text-[#ff6500]"
                />

                <label className="block text-gray-500 text-[11px] font-semibold mt-2 mb-1">
                  Stat {i + 1} Label
                </label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => {
                    const updated = [...currentData.stats];
                    updated[i].label = e.target.value;
                    setContent({
                      ...content,
                      [sectionKey]: { ...currentData, stats: updated },
                    });
                  }}
                  className="h-8 w-full rounded-lg border border-gray-300 px-2 text-xs bg-white font-medium text-gray-800"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Manage Site Content & Banners
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Dynamically customize Home, Themed Tour & Group Tour hero banners, images, stats, offer and contact info.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6500] hover:bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
        >
          <FaSave />
          <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 bg-white rounded-t-2xl px-4 sm:px-6 font-montserrat text-xs font-semibold gap-1">
        {[
          { id: "hero", label: "Home Page Banner" },
          { id: "themedHero", label: "Themed Tour Banner" },
          { id: "groupHero", label: "Group Tour Banner" },
          { id: "offer", label: "Festive Early Bird Offer" },
          { id: "contact", label: "Contact Details & Office" },
          { id: "footer", label: "Footer Info" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-3 sm:px-4 border-b-2 transition cursor-pointer ${
              activeTab === tab.id
                ? "border-[#ff6500] text-[#ff6500] font-bold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form */}
      <div className="rounded-b-2xl border border-t-0 border-gray-200 bg-white p-6 shadow-xs font-montserrat text-xs">
        {/* TAB 1: HOME PAGE BANNER */}
        {activeTab === "hero" &&
          renderBannerEditor(
            "hero",
            "Home Page Hero",
            "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80",
            false
          )}

        {/* TAB 2: THEMED TOUR BANNER */}
        {activeTab === "themedHero" &&
          renderBannerEditor(
            "themedHero",
            "Themed Tours Hero",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
            true
          )}

        {/* TAB 3: GROUP TOUR BANNER */}
        {activeTab === "groupHero" &&
          renderBannerEditor(
            "groupHero",
            "Group Tours Hero",
            "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=80",
            true
          )}

        {/* TAB 4: EARLY BIRD OFFER */}
        {activeTab === "offer" && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Offer Tag</label>
              <input
                type="text"
                value={content.offer?.tag || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    offer: { ...content.offer, tag: e.target.value },
                  })
                }
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Offer Heading</label>
              <input
                type="text"
                value={content.offer?.title || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    offer: { ...content.offer, title: e.target.value },
                  })
                }
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Offer Subtitle</label>
              <textarea
                rows="3"
                value={content.offer?.subtitle || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    offer: { ...content.offer, subtitle: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Button CTA Text</label>
              <input
                type="text"
                value={content.offer?.ctaText || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    offer: { ...content.offer, ctaText: e.target.value },
                  })
                }
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT DETAILS */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                WhatsApp Phone Number (for WhatsApp Bookings)
              </label>
              <input
                type="text"
                value={content.contact?.whatsapp || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, whatsapp: e.target.value },
                  })
                }
                placeholder="e.g. 919876543210"
                className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Enter number with country code without + or spaces (e.g. 919876543210 for India).
              </p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Corporate Office Address
              </label>
              <textarea
                rows="3"
                value={content.contact?.corporateOffice || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, corporateOffice: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Quick Contact Details (Tel / Fax)
              </label>
              <textarea
                rows="2"
                value={content.contact?.quickContact || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, quickContact: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email Addresses
              </label>
              <textarea
                rows="2"
                value={content.contact?.email || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={content.contact?.facebook || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, facebook: e.target.value },
                    })
                  }
                  placeholder="https://www.facebook.com/yourpage"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={content.contact?.instagram || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, instagram: e.target.value },
                    })
                  }
                  placeholder="https://www.instagram.com/yourprofile"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOOTER */}
        {activeTab === "footer" && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                About Leela Tours (Footer paragraph)
              </label>
              <textarea
                rows="3"
                value={content.footer?.aboutText || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, aboutText: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Footer Phone</label>
                <input
                  type="text"
                  value={content.footer?.phone || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, phone: e.target.value },
                    })
                  }
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Footer Email</label>
                <input
                  type="text"
                  value={content.footer?.email || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, email: e.target.value },
                    })
                  }
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Footer City/State</label>
                <input
                  type="text"
                  value={content.footer?.address || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, address: e.target.value },
                    })
                  }
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
