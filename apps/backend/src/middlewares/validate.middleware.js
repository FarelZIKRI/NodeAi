import { z } from 'zod';

/**
 * Factory middleware untuk memvalidasi body request menggunakan Zod schema.
 * @param {z.ZodSchema} schema - Zod schema yang digunakan untuk validasi.
 * @returns {Function} Express middleware.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        error: 'Data tidak valid.',
        details: errors,
      });
    }

    // Ganti req.body dengan data yang sudah divalidasi & diparse
    req.body = result.data;
    next();
  };
}
