export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route nahi mila: ${req.method} ${req.originalUrl}`,
  });
};

const normalizeError = (err) => {
  if (err?.name === "CastError") {
    return { statusCode: 400, message: "Invalid ID format." };
  }
  if (err?.name === "ValidationError") {
    const first = Object.values(err.errors || {})[0];
    return { statusCode: 400, message: first?.message || "Validation failed." };
  }
  if (err?.code === 11000) {
    return { statusCode: 409, message: "This record already exists." };
  }
  if (err?.type === "entity.too.large") {
    return { statusCode: 413, message: "Request too large. Chhoti image ya kam data bhejein." };
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return { statusCode: 400, message: "Invalid JSON in request body." };
  }
  return null;
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const normalized = normalizeError(err);
  const statusCode = normalized?.statusCode || err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const message =
    normalized?.message ||
    (isServerError && process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message || "Internal Server Error");

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && isServerError ? { stack: err.stack } : {}),
  });
};
