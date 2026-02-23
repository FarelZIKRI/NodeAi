import { authService } from '../services/auth.service.js';
import { fromNodeHeaders } from 'better-auth/node';

/**
 * Middleware autentikasi — memverifikasi sesi pengguna dari cookie/header.
 * Jika valid, `req.user` dan `req.session` akan terisi.
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await authService.getSession(fromNodeHeaders(req.headers));

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Tidak terautentikasi. Silakan login terlebih dahulu.' });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Sesi tidak valid.' });
  }
}
