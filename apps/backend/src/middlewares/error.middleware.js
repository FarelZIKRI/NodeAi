/**
 * Global error handler — menangkap semua error yang dilempar oleh route.
 * Tampilkan pesan error yang ramah pengguna di production.
 */
export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
