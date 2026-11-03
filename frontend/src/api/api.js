import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
});

export const TOKEN_KEY = "leela_admin_token";

// Attach JWT token automatically for admin requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A rejected token must end the session everywhere, not just on the page that
// happened to check it at mount time.
export const ADMIN_SESSION_EXPIRED_EVENT = "leela:admin-session-expired";

API.interceptors.response.use(null, (error) => {
  const url = error.config?.url || "";
  const isLoginAttempt = url.includes("/auth/login");
  if (error.response?.status === 401 && !isLoginAttempt) {
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
  }
  return Promise.reject(error);
});

// Auth API
export const loginAdmin = (data) => API.post("/auth/login", data);
export const logoutAdmin = (token) =>
  API.post(
    "/auth/logout",
    null,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
export const getAdminMe = () => API.get("/auth/me");
export const updateAdminProfile = (data) => API.put("/auth/update-profile", data);
export const changeAdminPassword = (data) => API.put("/auth/change-password", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => API.post(`/auth/reset-password/${token}`, data);

// Tours API
export const getTours = (params) => API.get("/tours", { params });
export const getTourCategories = () => API.get("/tours/categories");
export const getTourById = (id) => API.get(`/tours/${id}`);
export const createTour = (data) => API.post("/tours", data);
export const updateTour = (id, data) => API.put(`/tours/${id}`, data);
export const updateTourGallery = (id, gallery) => API.put(`/tours/${id}/gallery`, { gallery });
export const deleteTour = (id) => API.delete(`/tours/${id}`);

// Content API (Hero, Contact, Offer, Stats)
export const getContent = () => API.get("/content");
export const updateContent = (data) => API.put("/content", data);

// Enquiries API
export const submitEnquiry = (data) => API.post("/enquiries", data);
export const getEnquiries = () => API.get("/enquiries");
export const updateEnquiryStatus = (id, status) => API.put(`/enquiries/${id}`, { status });
export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}`);

// Reviews API
export const getReviews = (params) => API.get("/reviews", { params });
export const submitPublicReview = (data) => API.post("/reviews/submit", data);
export const approveReview = (id) => API.put(`/reviews/${id}/approve`);
export const createReview = (data) => API.post("/reviews", data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// FAQs API
export const getFaqs = (params) => API.get("/faqs", { params });
export const createFaq = (data) => API.post("/faqs", data);
export const updateFaq = (id, data) => API.put(`/faqs/${id}`, data);
export const deleteFaq = (id) => API.delete(`/faqs/${id}`);

export default API;
