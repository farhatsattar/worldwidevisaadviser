const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[${req.method}] ${req.originalUrl}`, err.message);

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "production"
      ? {}
      : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
