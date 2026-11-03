# Leela Tours & Services - Complete MERN Stack Application

Leela Tours MERN Stack Tour Management & Booking Web Application.

---

## 📁 Clean & Intuitive Folder Structure (आसानी से समझने और अपडेट करने के लिए)

```
Leela-tour-service/
│
├── backend/                              # Express.js + MongoDB API
│   ├── config/
│   │   └── db.js                         # MongoDB Database connection
│   ├── controllers/
│   │   ├── authController.js             # Admin authentication logic (JWT)
│   │   ├── tourController.js             # Tour CRUD & details page data
│   │   ├── contentController.js          # Home page & Contact page content
│   │   ├── enquiryController.js          # WhatsApp clicks & Contact inquiries
│   │   ├── reviewController.js           # Customer testimonials
│   │   └── faqController.js              # Frequently Asked Questions
│   ├── models/
│   │   ├── Admin.js                      # Admin User schema
│   │   ├── Tour.js                       # Comprehensive Tour schema (all 5 image sections)
│   │   ├── Content.js                    # Singleton Site Content schema
│   │   ├── Enquiry.js                    # Inquiries & WhatsApp leads schema
│   │   ├── Review.js                     # Testimonials schema
│   │   └── Faq.js                        # FAQs schema
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth
│   │   ├── tourRoutes.js                 # /api/tours
│   │   ├── contentRoutes.js              # /api/content
│   │   ├── enquiryRoutes.js              # /api/enquiries
│   │   ├── reviewRoutes.js               # /api/reviews
│   │   └── faqRoutes.js                  # /api/faqs
│   ├── middleware/
│   │   ├── authMiddleware.js             # Protected Admin JWT middleware
│   │   └── errorHandler.js               # Global error handler
│   ├── seed/
│   │   └── seedData.js                   # Pre-populates Admin + Magical Kashmir + Tours + Content
│   ├── .env                              # Port, Mongo URI, JWT Secret
│   ├── package.json
│   └── server.js                         # Express Server Entry Point
│
└── frontend/                             # React 19 + Vite + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   └── api.js                    # Centralized Axios API client
    │   ├── context/
    │   │   └── AdminAuthContext.jsx      # Admin login/session state
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Header.jsx            # Main site header with navigation & admin button
    │   │   │   ├── Footer.jsx            # Dynamic footer with contact details
    │   │   │   └── ProtectedRoute.jsx    # Guard for /admin pages
    │   │   ├── home/
    │   │   │   ├── Hero.jsx              # Hero banner with dynamic quote form & stats
    │   │   │   ├── TripSection.jsx       # Tours list with "View Details" button -> /tour/:id
    │   │   │   ├── WhySection.jsx        # Why Choose Us section
    │   │   │   ├── ThemedSection.jsx     # Themed tours scroll
    │   │   │   ├── StepsSection.jsx      # 3 Steps + Early Bird Offer Countdown
    │   │   │   ├── ReviewSection.jsx     # Dynamic customer testimonials
    │   │   │   ├── FaqSection.jsx        # Dynamic FAQ accordions
    │   │   │   └── ReadyToBook.jsx       # Call to Action banner
    │   │   └── tour-details/             # ⭐ 5 Image Designs Fully Recreated:
    │   │       ├── TourHeroBanner.jsx    # 📸 Image 1: Scenic Hero + Floating Pricing Card + WhatsApp CTA
    │   │       ├── TourOverview.jsx      # 📸 Image 2 (Left): 6 Highlight Cards (Duration, Group, Meals, Stay...)
    │   │       ├── TourBookingCard.jsx   # 📸 Image 2 (Right): Sticky Booking Calculator (+/- Travellers, % Booked)
    │   │       ├── TourItinerary.jsx     # 📸 Image 3: Day 1 to Day 6 Peach Badge Accordions
    │   │       ├── TourInclusions.jsx    # 📸 Image 4: Side-by-Side "In your price" vs "Not included"
    │   │       └── TourHighlightsVideo.jsx # 📸 Image 5: Video Container + Play Button + "Explore Upcoming Tours"
    │   ├── pages/
    │   │   ├── HomePage.jsx              # Public Home page
    │   │   ├── TourDetailsPage.jsx       # Public Tour View Details page
    │   │   ├── ContactPage.jsx           # Public Contact page (Office details + Form)
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx        # Secure Admin Login
    │   │       ├── AdminLayout.jsx       # Sidebar Layout with Navigation
    │   │       ├── AdminDashboard.jsx    # Metric cards & Recent Inquiries
    │   │       ├── ManageTours.jsx       # Add/Edit/Delete Tours with all 5 section fields
    │   │       ├── ManageContent.jsx     # Edit Home page texts, Stats, Early bird, Office info
    │   │       ├── ManageEnquiries.jsx   # Customer Inquiries & WhatsApp leads tracker
    │   │       ├── ManageReviews.jsx     # Add/Edit Customer Testimonials
    │   │       └── ManageFaqs.jsx        # Add/Edit FAQs
    │   ├── App.jsx                       # Master Routing
    │   └── main.jsx
    └── package.json
```

---

## 🔑 Admin Login

Admin credentials are **never hardcoded**. They are created by the seed script:

- **Development:** `admin@leelatours.com` / `admin123` (logged as a warning; change immediately)
- **Production:** seeding requires `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (min 8 chars)
- **Admin Portal URL:** `http://localhost:5173/admin/login`

After the first login, change the email and password from **Admin → Profile**.

---

## 🚀 How to Run Locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm run seed            # dev only: seeds admin, tours, content, reviews, FAQs
npm run dev             # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### 3. Production build
```bash
cd frontend
npm run build           # outputs frontend/dist
cd ../backend
npm start               # serves API + built frontend on PORT
```

---

## ⚙️ Environment Variables (backend/.env)

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | No | Defaults to `5000` |
| `NODE_ENV` | Yes | `development` or `production` |
| `MONGO_URI` | Yes | MongoDB Atlas / self-hosted URI |
| `JWT_SECRET` | Yes | Min 32 chars in production. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | No | Defaults to `7d` |
| `CLIENT_URL` | Yes | Frontend URL for CORS + reset links. Comma-separate multiple origins |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | No | SMTP server settings |
| `SMTP_USER` / `SMTP_PASS` | Prod | Required in production for password reset emails |
| `FROM_NAME` | No | Email sender name |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Prod seed | Required when seeding production |
| `SEED_FORCE` | Prod seed | Must be `yes`; seeding deletes existing data |

The server refuses to start when `MONGO_URI` is missing, `JWT_SECRET` is missing, or a production `JWT_SECRET` is shorter than 32 characters.

---

## 🛡️ Production Checklist

- Set `NODE_ENV=production` and a unique 64-char `JWT_SECRET`.
- Set `CLIENT_URL` to the real domain(s) — CORS rejects everything else.
- Configure real SMTP credentials; production never silently skips reset emails.
- Seed with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` and `SEED_FORCE=yes`, then change the password.
- Serve over HTTPS (Helmet sends HSTS; `trust proxy` is enabled in production).
- Back up MongoDB before seeding — the seed script wipes admins, tours, content, reviews and FAQs.
- Monitor `GET /api/health` (returns 503 when the database is disconnected).

Security features included:

- Helmet security headers with a CSP that allows Google Fonts and YouTube embeds.
- Rate limiting on the API, login/password reset, and public form submissions.
- Whitelisted request fields (no mass assignment), strict validation and bounded body sizes (10 MB for base64 image uploads).
- Escaped search filters, admin-only access to inactive/unapproved records, and no public `?all=true` bypass.
- Hashed password reset tokens (SHA-256, 15-minute expiry), generic forgot-password responses, and server-side logout via `tokenVersion`.
- Passwords hashed with bcrypt (12 rounds) and a minimum length of 8 characters.

---

## 📱 Social Links

Facebook and Instagram icons are shown in the footer. Their URLs are editable from
**Admin → Site Content → Contact Details** (fields: *Facebook Page URL*, *Instagram Profile URL*)
and stored in `content.contact.facebook` / `content.contact.instagram`.

