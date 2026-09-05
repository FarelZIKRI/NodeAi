// CJS wrapper — dynamic import() agar ESM modules tetap bisa di-load
// serverless-http ada di root node_modules (di-hoist oleh npm workspaces)
// app.js ada di apps/backend/src/app.js (ESM)
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const appPath = path.resolve(__dirname, '../../apps/backend/src/app.js');

    // serverless-http di-hoist ke root node_modules oleh npm workspaces
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
