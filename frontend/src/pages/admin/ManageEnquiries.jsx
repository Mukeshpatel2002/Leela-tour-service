import React, { useEffect, useState } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "../../api/api";
import { toast } from "react-hot-toast";
import { FaTrash, FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await getEnquiries();
      if (res.data?.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      toast.error("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      fetchEnquiries();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await deleteEnquiry(id);
        toast.success("Enquiry deleted.");
        fetchEnquiries();
      } catch (err) {
        toast.error("Error deleting enquiry.");
      }
    }
  };

  const filtered =
    filterStatus === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Customer Enquiries & Bookings
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Track inquiries submitted through contact forms and WhatsApp booking clicks.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-montserrat">
          {["all", "new", "contacted", "converted", "closed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`rounded-full px-3.5 py-1.5 font-bold uppercase transition cursor-pointer ${
                filterStatus === st
                  ? "bg-[#07569b] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No inquiries matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-montserrat">
              <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Tour / Date</th>
                  <th className="py-3 px-4">Details / Total</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((enq) => (
                  <tr key={enq._id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {enq.name}
                      <p className="text-[10px] text-gray-400 font-normal">
                        {new Date(enq.createdAt).toLocaleString()}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      {enq.email && (
                        <p className="flex items-center gap-1.5 text-gray-600">
                          <FaEnvelope className="text-[10px] text-gray-400" />
                          <span>{enq.email}</span>
                        </p>
                      )}
                      {enq.phone && enq.phone !== "WhatsApp User" && (
                        <p className="flex items-center gap-1.5 text-gray-600">
                          <FaPhone className="text-[10px] text-gray-400" />
                          <span>{enq.phone}</span>
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#07569b]">
                        {enq.tourTitle || "General Inquiry"}
                      </p>
                      {enq.departureDate && (
                        <p className="text-[11px] text-gray-500">{enq.departureDate}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {enq.estimatedTotal ? (
                        <p className="font-bold text-gray-900">
                          ₹{enq.estimatedTotal.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] font-normal text-gray-500">
                            ({enq.travellers} pax)
                          </span>
                        </p>
                      ) : null}
                      {enq.message && (
                        <p className="text-[11px] text-gray-600 line-clamp-2 max-w-xs mt-0.5">
                          "{enq.message}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                        {enq.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-bold uppercase outline-none cursor-pointer ${
                          enq.status === "new"
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : enq.status === "contacted"
                            ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                            : enq.status === "converted"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(enq._id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
