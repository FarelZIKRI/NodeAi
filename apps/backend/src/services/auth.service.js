import { auth } from '../config/auth.js';

/**
 * AuthService — Kelas layanan untuk operasi autentikasi.
 * Memanfaatkan Better Auth API secara internal.
 */
export class AuthService {
  /**
   * Mendapatkan sesi pengguna dari request headers.
   * @param {Headers} headers - Headers dari HTTP request.
   * @returns {Promise<{session: object, user: object} | null>}
   */
  async getSession(headers) {
    const session = await auth.api.getSession({ headers });
    return session;
  }
}

export const authService = new AuthService();
