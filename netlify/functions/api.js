const path = require('path');

exports.handler = async (event, context) => {
  try {
    if (event.path && event.path.includes('sign-in/social')) {
      // Cek SEMUA versi better-auth yang ada di node_modules
      const checkPaths = [
        '/var/task/node_modules/better-auth/package.json',
        '/var/task/apps/backend/node_modules/better-auth/package.json',
        '/var/task/node_modules/better-auth/node_modules/@better-auth/core/package.json',
      ];
      for (const p of checkPaths) {
        try {
          const pkg = require(p);
          console.log(`[DEBUG] ${p}: ${pkg.version}`);
        } catch(e) {
          console.log(`[DEBUG] ${p}: NOT FOUND`);
        }
      }

      // Cek SocialProviderListEnum yang digunakan saat runtime
      try {
        const { SocialProviderListEnum } = await import('/var/task/node_modules/better-auth/node_modules/@better-auth/core/dist/social-providers/index.mjs');
        const result = SocialProviderListEnum.safeParse('google');
        console.log('[DEBUG] SocialProviderListEnum.safeParse("google"):', JSON.stringify(result));
      } catch(e) {
        console.log('[DEBUG] safeParse check error:', e.message);
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
