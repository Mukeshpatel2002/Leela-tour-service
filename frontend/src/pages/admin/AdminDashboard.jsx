import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTours, getEnquiries, getReviews, getFaqs } from "../../api/api";
import {
  FaSuitcase,
  FaEnvelopeOpenText,
  FaStar,
  FaQuestionCircle,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tours: 0,
    enquiries: 0,
    reviews: 0,
    faqs: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [toursRes, enqRes, revRes, faqsRes] = await Promise.all([
          getTours({ all: "true" }),
          getEnquiries(),
          getReviews({ all: "true" }),
          getFaqs({ all: "true" }),
        ]);

        setStats({
          tours: toursRes.data?.count || 0,
          enquiries: enqRes.data?.count || 0,
          reviews: revRes.data?.count || 0,
          faqs: faqsRes.data?.count || 0,
        });

        if (enqRes.data?.enquiries) {
          setRecentEnquiries(enqRes.data.enquiries.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff6500] border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Tours",
      count: stats.tours,
      link: "/admin/tours",
      icon: <FaSuitcase className="text-2xl text-blue-600" />,
      bg: "bg-blue-50 border-blue-200",
    },
    {
      title: "Customer Inquiries",
      count: stats.enquiries,
      link: "/admin/enquiries",
      icon: <FaEnvelopeOpenText className="text-2xl text-orange-600" />,
      bg: "bg-orange-50 border-orange-200",
    },
    {
      title: "Testimonials",
      count: stats.reviews,
      link: "/admin/reviews",
      icon: <FaStar className="text-2xl text-yellow-600" />,
      bg: "bg-yellow-50 border-yellow-200",
    },
    {
      title: "Active FAQs",
      count: stats.faqs,
      link: "/admin/faqs",
      icon: <FaQuestionCircle className="text-2xl text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-caladea text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome! Manage tour packages, site information, and traveler bookings.
          </p>
        </div>

        <Link
          to="/admin/tours?action=add"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff6500] hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow transition"
        >
          <FaPlus />
          <span>Add New Tour</span>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`rounded-2xl border p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">{card.title}</span>
              {card.icon}
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-caladea text-4xl font-extrabold text-gray-900">
                {card.count}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#07569b]">
                Manage <FaArrowRight className="text-[10px]" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-caladea text-xl font-bold text-gray-800">
            Recent Enquiries & WhatsApp Leads
          </h2>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-[#ff6500] hover:underline"
          >
            View All ({stats.enquiries}) →
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-montserrat">
              <thead className="bg-gray-50 text-gray-500 uppercase border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Tour / Destination</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Est. Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-gray-50/80">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {enq.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#07569b] font-medium">
                      {enq.tourTitle || "Custom Tour"}
                    </td>
                    <td className="py-3.5 px-4">{enq.departureDate || "N/A"}</td>
                    <td className="py-3.5 px-4 font-bold">
                      {enq.estimatedTotal ? `₹${enq.estimatedTotal.toLocaleString("en-IN")}` : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          enq.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : enq.status === "contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : enq.status === "converted"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
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
