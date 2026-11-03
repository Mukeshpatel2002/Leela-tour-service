import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const isProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exitWithError = (message) => {
  console.error(`[Startup Error] ${message}`);
  process.exit(1);
};

// Fail fast instead of running with unsafe defaults.
if (!process.env.MONGO_URI) exitWithError("MONGO_URI missing hai. .env file check karein.");
if (!process.env.JWT_SECRET) exitWithError("JWT_SECRET missing hai. .env file check karein.");
if (isProduction && process.env.JWT_SECRET.length < 32) {
  exitWithError("JWT_SECRET kam se kam 32 characters ka hona chahiye.");
}

const app = express();
app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);

const normalizeOrigin = (value) => value.trim().replace(/\/$/, "");
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const isDevOrigin = (origin) =>
  !isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin)) || isDevOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("This origin is not allowed by CORS."));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https:", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        mediaSrc: ["'self'", "https:", "blob:"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"],
        connectSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());
if (!isProduction) app.use(morgan("dev"));

// Base64 image uploads (banners, gallery, review photos) need more room than plain JSON.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = dbStates[mongoose.connection.readyState] || "unknown";
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? "OK" : "DEGRADED",
    db: dbState,
    uptime: Math.round(process.uptime()),
  });
});

// API Endpoints
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/faqs", faqRoutes);

// Serve frontend build in production if available
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(
    express.static(frontendDist, {
      maxAge: isProduction ? "1y" : 0,
      setHeaders(res, filePath) {
        if (!filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

const start = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
};

const shutdown = (signal) => {
  console.log(`[${signal}] Shutting down gracefully...`);
  const closeDb = async () => {
    try {
      await mongoose.connection.close();
    } finally {
      process.exit(0);
    }
  };

  if (server) {
    server.close(closeDb);
  } else {
    closeDb();
  }

  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Rejection]", reason);
  shutdown("unhandledRejection");
});

start().catch((error) => {
  console.error("[Fatal Startup Error]", error);
  process.exit(1);
});
