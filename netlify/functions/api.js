// Wrapper CJS yang load ESM app via dynamic import
exports.handler = async (event, context) => {
  try {
    // Log request untuk debugging
    if (event.path && event.path.includes('sign-in/social')) {
      console.log('[DEBUG] sign-in/social request:');
      console.log('  method:', event.httpMethod);
      console.log('  body:', event.body);
      console.log('  headers content-type:', event.headers['content-type']);
    }

    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import('../../apps/backend/src/app.js');
    const handler = serverless(app);
    return handler(event, context);
  } catch (err) {
    console.error('[Netlify Function Error]', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
