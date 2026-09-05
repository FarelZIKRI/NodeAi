// Wrapper CJS yang load ESM app via dynamic import
exports.handler = async (event, context) => {
  try {
    // Debug: cek versi better-auth dan credentials
    if (event.path && event.path.includes('sign-in/social')) {
      try {
        const { createRequire } = require('module');
        const req = createRequire(import.meta ? import.meta.url : __filename);
        // Cek versi better-auth yang ter-resolve
        const baPkg = require('/var/task/node_modules/better-auth/package.json');
        console.log('[DEBUG] better-auth version at runtime:', baPkg.version);
      } catch(e) {
        console.log('[DEBUG] version check error:', e.message);
      }
      console.log('[DEBUG] GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
      console.log('[DEBUG] GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
      console.log('[DEBUG] BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL);
      console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
      console.log('[DEBUG] body:', event.body);
    }

    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import('../../apps/backend/src/app.js');
    const handler = serverless(app);
    return handler(event, context);
  } catch (err) {
    console.error('[Netlify Function Error]', err.message, err.stack?.split('\n').slice(0,3).join(' | '));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
