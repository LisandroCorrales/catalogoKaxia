export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor.";
  const timestamp = new Date().toISOString();
  
  console.error(`[Error Handler] ${statusCode} - ${message}`, err.stack || "");
  
  res.status(statusCode).json({
    message,
    status: statusCode,
    timestamp
  });
};
