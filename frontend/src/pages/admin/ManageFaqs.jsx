import React, { useEffect, useState } from "react";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "../../api/api";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

export default function ManageFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
    isActive: true,
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await getFaqs({ all: "true" });
      if (res.data?.success) {
        setFaqs(res.data.faqs);
      }
    } catch (err) {
      toast.error("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ question: "", answer: "", order: faqs.length + 1, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingId(faq._id);
    setFormData(faq);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id);
        toast.success("FAQ deleted.");
        fetchFaqs();
      } catch (err) {
        toast.error("Error deleting FAQ.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaq(editingId, formData);
        toast.success("FAQ updated successfully!");
      } else {
        await createFaq(formData);
        toast.success("FAQ added successfully!");
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      toast.error("Failed to save FAQ.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Manage FAQs & Accordion
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Update frequently asked questions and answers displayed on the home page.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6500] hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow transition cursor-pointer"
        >
          <FaPlus />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQs List Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-montserrat">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-16">Order</th>
                  <th className="py-3 px-4">Question</th>
                  <th className="py-3 px-4">Answer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-bold text-gray-400">#{faq.order}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                      {faq.question}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-lg line-clamp-2">
                      {faq.answer}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(faq)}
                          className="rounded-lg p-2 text-orange-600 hover:bg-orange-50 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(faq._id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 cursor-pointer"
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

      {/* FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h2 className="font-caladea text-xl font-bold text-[#07569b]">
                {editingId ? "Edit FAQ" : "Add FAQ Question"}
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
                  Question *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                  placeholder="e.g. How can I Book a Tour?"
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Display Order Number
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows="4"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  placeholder="Write the detailed answer..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500"
                />
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
                  {editingId ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
