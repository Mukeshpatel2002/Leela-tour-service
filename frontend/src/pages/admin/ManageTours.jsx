import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getTours, createTour, updateTour, deleteTour } from "../../api/api";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheck,
  FaLayerGroup,
} from "react-icons/fa";

export default function ManageTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tourTypeFilter, setTourTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // basic | highlights | booking | itinerary | inclusions | video

  // Form State matching all 5 Images
  const initialFormState = {
    title: "",
    tourType: "Themed Tour",
    category: "Sacred Journeys",
    route: "",
    duration: "6D/5N",
    price: 24999,
    oldPrice: 28999,
    rating: 4.9,
    reviewsCount: 120,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80",
    subHeading: "itinerary-focused",
    dateSubtitle: "6D / 5N · 12 Oct 2026",
    highlights: {
      durationText: "6 days, 5 nights",
      groupSize: "Up to 30 travellers",
      startEnd: "Srinagar airport",
      meals: "Breakfast and dinner",
      stay: "Houseboat and 3 star hotels",
      bestFor: "Families, couples, seniors",
    },
    departureCity: "Srinagar airport",
    bookedPercent: 87,
    seatsLeft: 4,
    departureDates: [
      { date: "24 Oct 2026 (4 seat left)", seatsLeft: 4 },
      { date: "05 Nov 2026 (6 seats left)", seatsLeft: 6 },
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome To Srinagar",
        location: "Srinagar",
        description: "Arrival at Srinagar airport and transfer to houseboat.",
        stay: "Houseboat on Dal Lake",
        meals: "Dinner",
      },
      {
        day: 2,
        title: "Srinagar to Gulmarg Excursion",
        location: "Gulmarg",
        description: "Gondola cable car ride and snow peaks.",
        stay: "3-Star Hotel",
        meals: "Breakfast & Dinner",
      },
    ],
    inclusions: [
      "5 nights stay, including 1 night on a houseboat",
      "Breakfast and dinner every day",
      "Private vehicle for all sightseeing",
      "Shikara ride on Dal Lake",
      "Airport pickup and drop in Srinagar",
      "Tour manager with the group all 6 days",
      "All tolls, parking and driver charges",
    ],
    exclusions: [
      "Flights or trains to Srinagar",
      "Gondola tickets and pony rides",
      "Lunch and personal expenses",
      "Travel insurance",
      "Anything not listed as included",
    ],
    videoTitle: "Our Kashmir Trip Highlights",
    videoSubtitle: "REAL TRIPS. REAL MEMORIES.",
    videoThumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    videoUrl: "https://www.youtube.com/embed/fD3Xj02nL3w",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    ],
    isFeatured: true,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // Fetch Tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await getTours({ all: "true" });
      if (res.data?.success) {
        setTours(res.data.tours);
      }
    } catch (err) {
      toast.error("Failed to load tours.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Handle URL action=add
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      openAddModal();
      setSearchParams({});
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (tour) => {
    setEditingId(tour._id);
    setFormData({
      ...initialFormState,
      ...tour,
      tourType: tour.tourType || "Themed Tour",
      category: tour.category || "Sacred Journeys",
      highlights: { ...initialFormState.highlights, ...(tour.highlights || {}) },
      departureDates: tour.departureDates?.length ? tour.departureDates : initialFormState.departureDates,
      itinerary: tour.itinerary?.length ? tour.itinerary : initialFormState.itinerary,
      inclusions: tour.inclusions?.length ? tour.inclusions : initialFormState.inclusions,
      exclusions: tour.exclusions?.length ? tour.exclusions : initialFormState.exclusions,
      gallery: tour.gallery?.length ? tour.gallery : initialFormState.gallery,
    });
    setGalleryUrlInput("");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteTour(id);
        toast.success("Tour deleted successfully.");
        fetchTours();
      } catch (err) {
        toast.error("Error deleting tour.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTour(editingId, formData);
        toast.success("Tour updated successfully!");
      } else {
        await createTour(formData);
        toast.success("New tour created successfully!");
      }
      setIsModalOpen(false);
      fetchTours();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save tour.");
    }
  };

  // Itinerary Helpers
  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        {
          day: nextDay,
          title: `Day ${nextDay} Sightseeing`,
          location: formData.departureCity || "Destination",
          description: "Full day sightseeing and activities.",
          stay: "Comfortable Hotel",
          meals: "Breakfast & Dinner",
        },
      ],
    });
  };

  const removeItineraryDay = (index) => {
    const updated = formData.itinerary.filter((_, i) => i !== index);
    // Re-number days
    const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
    setFormData({ ...formData, itinerary: renumbered });
  };

  // Departure Dates Helpers
  const addDepartureDate = () => {
    setFormData({
      ...formData,
      departureDates: [
        ...formData.departureDates,
        { date: "15 Dec 2026 (4 seats left)", seatsLeft: 4 },
      ],
    });
  };

  const removeDepartureDate = (index) => {
    setFormData({
      ...formData,
      departureDates: formData.departureDates.filter((_, i) => i !== index),
    });
  };

  // Gallery Helpers
  const addGalleryImage = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData({
      ...formData,
      gallery: [...(formData.gallery || []), galleryUrlInput.trim()],
    });
    setGalleryUrlInput("");
  };

  const removeGalleryImage = (index) => {
    setFormData({
      ...formData,
      gallery: (formData.gallery || []).filter((_, i) => i !== index),
    });
  };

  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
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

  const handleGalleryFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const compressedImages = await Promise.all(
        files.map((file) => compressImage(file))
      );
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...compressedImages],
      }));
      toast.success(`${files.length} image(s) optimized & uploaded to gallery!`);
    } catch (err) {
      toast.error("Failed to process some images.");
    }

    e.target.value = "";
  };

  const loadDefaultGallery = () => {
    const samples = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    ];
    setFormData((prev) => ({
      ...prev,
      gallery: samples,
    }));
    toast.success("Loaded 5 sample gallery images!");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Manage Tours & Packages
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Create and edit tour packages, day-by-day itineraries, highlights, pricing, and video embeds.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6500] hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow transition cursor-pointer"
        >
          <FaPlus />
          <span>Add New Tour</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Tours" },
            { id: "themed", label: "Themed Tours" },
            { id: "group", label: "Group Tours" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTourTypeFilter(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer shrink-0 ${
                tourTypeFilter === tab.id
                  ? "bg-[#07569b] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tour title, route or category..."
            className="h-10 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tour List Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
          </div>
        ) : tours.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No tours found. Click "Add New Tour" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Tour</th>
                  <th className="py-3 px-4">Type & Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {tours
                  .filter((t) => {
                    if (tourTypeFilter !== "all") {
                      const tType = (t.tourType || "Themed Tour").toLowerCase();
                      if (!tType.includes(tourTypeFilter.toLowerCase()) && tType !== "both") {
                        return false;
                      }
                    }
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      const matchTitle = t.title?.toLowerCase().includes(q);
                      const matchCat = t.category?.toLowerCase().includes(q);
                      const matchRoute = t.route?.toLowerCase().includes(q);
                      if (!matchTitle && !matchCat && !matchRoute) return false;
                    }
                    return true;
                  })
                  .map((tour) => (
                    <tr key={tour._id} className="hover:bg-gray-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="h-12 w-16 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{tour.title}</p>
                            <p className="text-[11px] text-gray-500">{tour.route}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              tour.tourType?.toLowerCase().includes("group")
                                ? "bg-purple-100 text-purple-800"
                                : tour.tourType?.toLowerCase().includes("both")
                                ? "bg-teal-100 text-teal-800"
                                : "bg-blue-100 text-[#07569b]"
                            }`}
                          >
                            {tour.tourType || "Themed Tour"}
                          </span>
                          <span className="font-semibold text-gray-800 text-[12px]">
                            {tour.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#07569b]">{tour.duration}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">
                        ₹{tour.price?.toLocaleString("en-IN")}
                      </span>
                      {tour.oldPrice > tour.price && (
                        <span className="ml-1 text-[10px] text-gray-400 line-through">
                          ₹{tour.oldPrice?.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{tour.itinerary?.length || 0} Days</td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          tour.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {tour.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/tour/${tour._id}`}
                          target="_blank"
                          title="View Live Tour Page"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <FaEye />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(tour)}
                          title="Edit Tour"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tour._id, tour.title)}
                          title="Delete Tour"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL TOUR CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-caladea text-2xl font-bold text-[#07569b]">
                {editingId ? `Edit Tour: ${formData.title}` : "Add New Tour Package"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/80 px-6 text-xs font-semibold">
              {[
                { id: "basic", label: "1. Basic & Pricing" },
                { id: "highlights", label: "2. Highlights (Img 2)" },
                { id: "booking", label: "3. Booking & Dates" },
                { id: "itinerary", label: `4. Itinerary (${formData.itinerary?.length || 0} Days)` },
                { id: "inclusions", label: "5. Inclusions (Img 4)" },
                { id: "video", label: "6. Video & Media (Img 5)" },
                { id: "gallery", label: `7. Gallery (${formData.gallery?.length || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 transition cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#ff6500] text-[#ff6500] bg-white font-bold"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: Basic & Pricing */}
              {activeTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Tour Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g. Magical Kashmir"
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Tour Type *
                    </label>
                    <select
                      value={formData.tourType || "Themed Tour"}
                      onChange={(e) => {
                        const newType = e.target.value;
                        let defaultCat = formData.category;
                        if (
                          newType === "Group Tour" &&
                          (!defaultCat ||
                            defaultCat === "Sacred Journeys" ||
                            defaultCat === "Romantic Escapes")
                        ) {
                          defaultCat = "Friends & Family Trips";
                        } else if (
                          newType === "Themed Tour" &&
                          (!defaultCat || defaultCat === "Friends & Family Trips")
                        ) {
                          defaultCat = "Sacred Journeys";
                        }
                        setFormData({ ...formData, tourType: newType, category: defaultCat });
                      }}
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 font-medium bg-white"
                    >
                      <option value="Themed Tour">Themed Tour</option>
                      <option value="Group Tour">Group Tour</option>
                      <option value="Both">Both (Themed & Group)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Category *
                    </label>
                    <div className="space-y-1.5">
                      <select
                        value={
                          (formData.tourType === "Group Tour"
                            ? [
                                "Friends & Family Trips",
                                "School Group Tours",
                                "Senior Group Tours",
                                "Corporate Tours",
                                "Weekend Getaways",
                              ]
                            : [
                                "Sacred Journeys",
                                "Romantic Escapes",
                                "Heritage & Culture",
                                "Mountains",
                                "Wildlife & Adventure",
                                "Family Holidays",
                              ]
                          ).includes(formData.category)
                            ? formData.category
                            : "__custom__"
                        }
                        onChange={(e) => {
                          if (e.target.value !== "__custom__") {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500 font-medium bg-white"
                      >
                        <optgroup label="Preset Categories">
                          {formData.tourType === "Group Tour" ? (
                            <>
                              <option value="Friends & Family Trips">Friends & Family Trips</option>
                              <option value="School Group Tours">School Group Tours</option>
                              <option value="Senior Group Tours">Senior Group Tours</option>
                              <option value="Corporate Tours">Corporate Tours</option>
                              <option value="Weekend Getaways">Weekend Getaways</option>
                            </>
                          ) : (
                            <>
                              <option value="Sacred Journeys">Sacred Journeys</option>
                              <option value="Romantic Escapes">Romantic Escapes</option>
                              <option value="Heritage & Culture">Heritage & Culture</option>
                              <option value="Mountains">Mountains</option>
                              <option value="Wildlife & Adventure">Wildlife & Adventure</option>
                              <option value="Family Holidays">Family Holidays</option>
                            </>
                          )}
                        </optgroup>
                        <option value="__custom__">Custom / Enter New Category Below</option>
                      </select>

                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        placeholder="Or type custom category name..."
                        className="h-9 w-full rounded-xl border border-gray-300 px-3 text-xs focus:border-blue-500 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Duration Badge</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 6D/5N"
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Locations / Route
                    </label>
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      placeholder="e.g. Srinagar · Gulmarg · Pahalgam"
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Price (₹ per person) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Old Price (₹ strikethrough)
                    </label>
                    <input
                      type="number"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Hero Banner Image URL (Image 1)
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Best Seller"
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Highlights (Image 2 - Left) */}
              {activeTab === "highlights" && (
                <div className="space-y-4 text-xs font-montserrat">
                  <p className="text-gray-500">
                    These 6 details appear in the cards on the left column in Section 2 (Image 2).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Duration Text</label>
                      <input
                        type="text"
                        value={formData.highlights?.durationText || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, durationText: e.target.value },
                          })
                        }
                        placeholder="e.g. 6 days, 5 nights"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Group Size</label>
                      <input
                        type="text"
                        value={formData.highlights?.groupSize || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, groupSize: e.target.value },
                          })
                        }
                        placeholder="e.g. Up to 30 travellers"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Starts and Ends</label>
                      <input
                        type="text"
                        value={formData.highlights?.startEnd || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, startEnd: e.target.value },
                          })
                        }
                        placeholder="e.g. Srinagar airport"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Meals</label>
                      <input
                        type="text"
                        value={formData.highlights?.meals || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, meals: e.target.value },
                          })
                        }
                        placeholder="e.g. Breakfast and dinner"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stay</label>
                      <input
                        type="text"
                        value={formData.highlights?.stay || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, stay: e.target.value },
                          })
                        }
                        placeholder="e.g. Houseboat and 3 star hotels"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Best For</label>
                      <input
                        type="text"
                        value={formData.highlights?.bestFor || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlights: { ...formData.highlights, bestFor: e.target.value },
                          })
                        }
                        placeholder="e.g. Families, couples, seniors"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Booking Info & Departure Dates */}
              {activeTab === "booking" && (
                <div className="space-y-4 text-xs font-montserrat">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Departure City</label>
                      <input
                        type="text"
                        value={formData.departureCity}
                        onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                        placeholder="e.g. Srinagar airport"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">% Booked Progress</label>
                      <input
                        type="number"
                        value={formData.bookedPercent}
                        onChange={(e) => setFormData({ ...formData, bookedPercent: Number(e.target.value) })}
                        placeholder="e.g. 87"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Seats Left Warning</label>
                      <input
                        type="number"
                        value={formData.seatsLeft}
                        onChange={(e) => setFormData({ ...formData, seatsLeft: Number(e.target.value) })}
                        placeholder="e.g. 4"
                        className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Departure Dates List */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-bold text-gray-800 text-sm">
                        Available Departure Dates (Dropdown Options)
                      </label>
                      <button
                        type="button"
                        onClick={addDepartureDate}
                        className="flex items-center gap-1 rounded-lg bg-blue-50 text-blue-600 px-3 py-1.5 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        <FaPlus /> Add Date
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.departureDates?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => {
                              const updated = [...formData.departureDates];
                              updated[idx].date = e.target.value;
                              setFormData({ ...formData, departureDates: updated });
                            }}
                            placeholder="e.g. 24 Oct 2026 (4 seat left)"
                            className="h-9 flex-1 rounded-lg border border-gray-300 px-3 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeDepartureDate(idx)}
                            className="p-2 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Day by Day Itinerary Builder (Image 3) */}
              {activeTab === "itinerary" && (
                <div className="space-y-4 text-xs font-montserrat">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500">
                      Day-by-Day schedule matching Image 3 with Peach Day badges.
                    </p>
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="flex items-center gap-1.5 rounded-xl bg-[#ff6500] text-white px-3.5 py-2 text-xs font-bold hover:bg-orange-600 cursor-pointer"
                    >
                      <FaPlus /> Add Next Day
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.itinerary?.map((dayItem, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-orange-200 bg-orange-50/20 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-[#ffe9db] px-2.5 py-1 font-bold text-gray-900">
                            DAY {dayItem.day}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(idx)}
                            className="text-red-500 hover:text-red-700 cursor-pointer text-xs flex items-center gap-1"
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">
                              Day Title
                            </label>
                            <input
                              type="text"
                              value={dayItem.title}
                              onChange={(e) => {
                                const updated = [...formData.itinerary];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, itinerary: updated });
                              }}
                              placeholder="e.g. Welcome To Srinagar"
                              className="h-9 w-full rounded-lg border border-gray-300 px-3 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={dayItem.location}
                              onChange={(e) => {
                                const updated = [...formData.itinerary];
                                updated[idx].location = e.target.value;
                                setFormData({ ...formData, itinerary: updated });
                              }}
                              placeholder="e.g. Srinagar"
                              className="h-9 w-full rounded-lg border border-gray-300 px-3 text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">
                            Day Description
                          </label>
                          <textarea
                            rows="2"
                            value={dayItem.description}
                            onChange={(e) => {
                              const updated = [...formData.itinerary];
                              updated[idx].description = e.target.value;
                              setFormData({ ...formData, itinerary: updated });
                            }}
                            placeholder="Details of sightseeing, places visited..."
                            className="w-full rounded-lg border border-gray-300 p-2.5 text-xs bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">
                              Night Stay
                            </label>
                            <input
                              type="text"
                              value={dayItem.stay || ""}
                              onChange={(e) => {
                                const updated = [...formData.itinerary];
                                updated[idx].stay = e.target.value;
                                setFormData({ ...formData, itinerary: updated });
                              }}
                              placeholder="e.g. Deluxe Houseboat, Dal Lake"
                              className="h-8 w-full rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">
                              Meals Included
                            </label>
                            <input
                              type="text"
                              value={dayItem.meals || ""}
                              onChange={(e) => {
                                const updated = [...formData.itinerary];
                                updated[idx].meals = e.target.value;
                                setFormData({ ...formData, itinerary: updated });
                              }}
                              placeholder="e.g. Breakfast & Dinner"
                              className="h-8 w-full rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Inclusions & Exclusions (Image 4) */}
              {activeTab === "inclusions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-montserrat">
                  {/* Inclusions */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-sm">
                        In your price (Inclusions)
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            inclusions: [...formData.inclusions, "New inclusion item"],
                          })
                        }
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        + Add Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.inclusions?.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inc}
                            onChange={(e) => {
                              const updated = [...formData.inclusions];
                              updated[i] = e.target.value;
                              setFormData({ ...formData, inclusions: updated });
                            }}
                            className="h-8 flex-1 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                inclusions: formData.inclusions.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 text-sm">
                        Not included (Exclusions)
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            exclusions: [...formData.exclusions, "New exclusion item"],
                          })
                        }
                        className="text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        + Add Item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.exclusions?.map((exc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exc}
                            onChange={(e) => {
                              const updated = [...formData.exclusions];
                              updated[i] = e.target.value;
                              setFormData({ ...formData, exclusions: updated });
                            }}
                            className="h-8 flex-1 rounded-lg border border-gray-300 px-2.5 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                exclusions: formData.exclusions.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Video Highlights (Image 5) */}
              {activeTab === "video" && (
                <div className="space-y-4 text-xs font-montserrat">
                  <p className="text-gray-500">
                    Video section matching Image 5: "REAL TRIPS. REAL MEMORIES."
                  </p>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Video Heading</label>
                    <input
                      type="text"
                      value={formData.videoTitle}
                      onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder="e.g. Our Kashmir Trip Highlights"
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Video Subtitle / Tag
                    </label>
                    <input
                      type="text"
                      value={formData.videoSubtitle}
                      onChange={(e) => setFormData({ ...formData, videoSubtitle: e.target.value })}
                      placeholder="e.g. REAL TRIPS. REAL MEMORIES."
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Video Thumbnail Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.videoThumbnail}
                      onChange={(e) => setFormData({ ...formData, videoThumbnail: e.target.value })}
                      placeholder="https://..."
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      YouTube / Video Embed URL
                    </label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: Travel Gallery Images */}
              {activeTab === "gallery" && (
                <div className="space-y-6 text-xs font-montserrat">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                    <div>
                      <h4 className="text-sm font-bold text-[#07569b]">
                        Tour Gallery ("Moments Worth Remembering")
                      </h4>
                      <p className="text-gray-500 mt-0.5">
                        Upload or paste image URLs. The first 5 images are laid out in the 3-column showcase matching the design image.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={loadDefaultGallery}
                      className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 font-bold text-white transition cursor-pointer"
                    >
                      Load Sample 5 Images
                    </button>
                  </div>

                  {/* Add Image Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option A: Upload Files from Device */}
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 p-4 text-center hover:border-[#ff6500] transition">
                      <p className="font-bold text-gray-700 mb-1">
                        Upload Images From Device
                      </p>
                      <p className="text-[11px] text-gray-500 mb-3">
                        Select one or multiple images (.jpg, .png, .webp)
                      </p>
                      <label className="inline-flex items-center gap-2 rounded-xl bg-[#07569b] hover:bg-[#064780] px-4 py-2 text-xs font-bold text-white cursor-pointer transition">
                        <span>Browse Files</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Option B: Add by URL */}
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-bold text-gray-700 mb-1">Add Image by URL</p>
                      <p className="text-[11px] text-gray-500 mb-2">
                        Paste any image URL (Unsplash, Cloudinary, etc.)
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={galleryUrlInput}
                          onChange={(e) => setGalleryUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="h-9 flex-1 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={addGalleryImage}
                          className="rounded-xl bg-[#ff6500] hover:bg-orange-600 px-4 py-2 font-bold text-white transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Grid Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800">
                        Gallery Images ({formData.gallery?.length || 0})
                      </span>
                      {formData.gallery?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gallery: [] })}
                          className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {(!formData.gallery || formData.gallery.length === 0) ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
                        No images added yet. Click "Load Sample 5 Images" or upload photos above.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {formData.gallery.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery item ${idx + 1}`}
                              className="h-28 w-full object-cover"
                            />
                            {/* Position label */}
                            <span className="absolute left-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {idx === 0
                                ? "#1 (Tall Left)"
                                : idx === 1
                                ? "#2 (Mid Top)"
                                : idx === 2
                                ? "#3 (Mid Btm)"
                                : idx === 3
                                ? "#4 (Right Top)"
                                : idx === 4
                                ? "#5 (Right Btm)"
                                : `#${idx + 1}`}
                            </span>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              title="Delete photo"
                              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition cursor-pointer"
                            >
                              <FaTrash className="text-[10px]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons Bar */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ff6500] hover:bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow transition cursor-pointer"
                >
                  {editingId ? "Update Tour" : "Create Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
