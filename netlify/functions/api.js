// Wrapper CJS yang load ESM app via dynamic import
exports.handler = async (event, context) => {
  try {
    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import('../../apps/backend/src/app.js');
    const handler = serverless(app);
    return handler(event, context);
  } catch (err) {
    console.error('[Netlify Function Error]', err.message, err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack?.split('\n').slice(0, 5) }),
    };
  }
};
