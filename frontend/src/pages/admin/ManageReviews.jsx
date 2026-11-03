import React, { useEffect, useState } from "react";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
} from "../../api/api";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaStar,
  FaLink,
  FaWhatsapp,
  FaCamera,
  FaUserCheck,
} from "react-icons/fa";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'pending' | 'approved'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    name: "",
    tour: "Magical Kashmir",
    review: "",
    rating: 5,
    photo: "",
    userEmail: "",
    userPhone: "",
    isApproved: true,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getReviews({ all: "true" });
      if (res.data?.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (rev) => {
    setEditingId(rev._id);
    setFormData({
      name: rev.name || "",
      tour: rev.tour || "Magical Kashmir",
      review: rev.review || "",
      rating: rev.rating || 5,
      photo: rev.photo || "",
      userEmail: rev.userEmail || "",
      userPhone: rev.userPhone || "",
      isApproved: rev.isApproved !== undefined ? rev.isApproved : true,
      isActive: rev.isActive !== undefined ? rev.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleApprove = async (id, title) => {
    try {
      const res = await approveReview(id);
      if (res.data?.success) {
        toast.success(`Review from "${title}" approved! It is now live on the site.`);
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to approve review.");
    }
  };

  const handleToggleApproval = async (rev) => {
    try {
      const newStatus = !rev.isApproved;
      await updateReview(rev._id, { isApproved: newStatus });
      toast.success(newStatus ? "Review published!" : "Review un-published.");
      fetchReviews();
    } catch (err) {
      toast.error("Error updating review status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id);
        toast.success("Review deleted.");
        fetchReviews();
      } catch (err) {
        toast.error("Error deleting review.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateReview(editingId, formData);
        toast.success("Review updated successfully!");
      } else {
        await createReview(formData);
        toast.success("Review added successfully!");
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to save review.");
    }
  };

  const copyReviewUrl = () => {
    const url = `${window.location.origin}/submit-review`;
    navigator.clipboard.writeText(url);
    toast.success("Review Form Link copied to clipboard!");
  };

  const shareReviewWhatsApp = () => {
    const url = `${window.location.origin}/submit-review`;
    const message = encodeURIComponent(
      `Hello! Thank you for choosing Leela Tours & Travels. We hope you had an unforgettable holiday! Please take 1 minute to share your review and photos with us here: ${url}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
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

  const handleModalPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        photo: compressed,
      }));
      toast.success("Photo optimized!");
    } catch (err) {
      toast.error("Failed to process photo.");
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (filterTab === "pending") return r.isApproved === false;
    if (filterTab === "approved") return r.isApproved !== false;
    return true;
  });

  const pendingCount = reviews.filter((r) => r.isApproved === false).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Manage Testimonials & Tourist Reviews
          </h1>
          <p className="mt-1 text-xs text-gray-500 font-montserrat">
            Approve tourist reviews submitted online, or manually add testimonials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Copy Review Form URL */}
          <button
            type="button"
            onClick={copyReviewUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition cursor-pointer"
            title="Copy URL to send to customers"
          >
            <FaLink className="text-[#07569b]" />
            <span>Copy Review Link</span>
          </button>

          {/* Share on WhatsApp */}
          <button
            type="button"
            onClick={shareReviewWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl bg-[#08a900] hover:bg-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
            title="Ask tourist for review on WhatsApp"
          >
            <FaWhatsapp className="text-sm" />
            <span>Ask Review on WhatsApp</span>
          </button>

          {/* Add Manual Testimonial */}
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ff6500] hover:bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow transition cursor-pointer"
          >
            <FaPlus />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-gray-200 text-xs font-bold font-montserrat">
        <button
          type="button"
          onClick={() => setFilterTab("all")}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            filterTab === "all"
              ? "border-[#ff6500] text-[#ff6500]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab("pending")}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            filterTab === "pending"
              ? "border-[#ff6500] text-[#ff6500]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Pending Approval</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setFilterTab("approved")}
          className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
            filterTab === "approved"
              ? "border-[#ff6500] text-[#ff6500]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Approved & Published ({reviews.length - pendingCount})
        </button>
      </div>

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs font-montserrat">
            {filterTab === "pending"
              ? "No pending reviews. All submissions have been approved!"
              : "No reviews found in this filter."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-montserrat">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Tour Destination</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Text</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50/70">
                    {/* Photo thumbnail */}
                    <td className="py-3.5 px-4">
                      {rev.photo ? (
                        <img
                          src={rev.photo}
                          alt={rev.name}
                          className="h-11 w-11 rounded-xl object-cover border border-orange-200 shadow-xs"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-[#07569b] font-bold text-sm">
                          {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </td>

                    {/* Customer Name & contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{rev.name}</p>
                      {rev.userPhone && (
                        <p className="text-[11px] text-gray-500">{rev.userPhone}</p>
                      )}
                      {rev.userEmail && (
                        <p className="text-[11px] text-gray-500">{rev.userEmail}</p>
                      )}
                    </td>

                    {/* Tour Name */}
                    <td className="py-3.5 px-4 font-semibold text-[#07569b]">
                      {rev.tour}
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 text-amber-500 font-bold whitespace-nowrap">
                      {"★".repeat(rev.rating || 5)}
                    </td>

                    {/* Review text */}
                    <td className="py-3.5 px-4 max-w-xs text-gray-600 leading-snug">
                      "{rev.review}"
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {rev.isApproved === false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                          Pending Approval
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-800">
                          <FaCheck className="text-[10px]" /> Published
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* One-click Approve Button for pending */}
                        {rev.isApproved === false ? (
                          <button
                            type="button"
                            onClick={() => handleApprove(rev._id, rev.name)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 hover:bg-green-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                            title="Approve and show on website"
                          >
                            <FaCheck />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleApproval(rev)}
                            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                            title="Unpublish from website"
                          >
                            Unpublish
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(rev)}
                          className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(rev._id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete"
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

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h2 className="font-caladea text-xl font-bold text-[#07569b]">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-montserrat text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Rahul Patil"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tour Destination / Tag *
                </label>
                <input
                  type="text"
                  value={formData.tour}
                  onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                  required
                  placeholder="e.g. Magical Kashmir, Kerala Honeymoon"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.userPhone}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Review Content *
                </label>
                <textarea
                  rows="4"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                  placeholder="Write the customer's testimonial..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
                />
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Customer / Trip Photo
                </label>
                <div className="flex items-center gap-3">
                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="h-12 w-12 rounded-xl object-cover border"
                    />
                  )}
                  <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <FaCamera className="text-gray-500" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModalPhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.photo && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photo: "" })}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Approval status checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="h-4 w-4 rounded text-[#ff6500] focus:ring-[#ff6500]"
                />
                <label htmlFor="isApproved" className="font-semibold text-gray-800 cursor-pointer">
                  Approved & Visible on Website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ff6500] hover:bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow cursor-pointer"
                >
                  {editingId ? "Update Review" : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
