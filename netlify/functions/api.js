const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Log versi better-auth dan social providers yang terdaftar
    if (event.path && event.path.includes('sign-in/social')) {
      try {
        const baPkg = require(path.resolve(__dirname, '../../node_modules/better-auth/package.json'));
        console.log('[DEBUG] better-auth version:', baPkg.version);
      } catch(e) {
        console.log('[DEBUG] cannot read ba version:', e.message);
      }

      // Import auth config dan log social providers yang terdaftar
      try {
        const { auth } = await import('../../apps/backend/src/config/auth.js');
        const providers = auth.options?.socialProviders || {};
        console.log('[DEBUG] registered socialProviders keys:', Object.keys(providers));
        console.log('[DEBUG] google clientId exists:', !!providers.google?.clientId);
      } catch(e) {
        console.log('[DEBUG] cannot read auth config:', e.message);
      }
    }

    const appPath = path.resolve(__dirname, '../../apps/backend/src/app.js');
    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import(appPath);
    const handler = serverless(app);
    return handler(event, context);
  } catch (err) {
    console.error('[Function Error]', err.message, err.stack?.split('\n').slice(0, 3).join(' | '));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
