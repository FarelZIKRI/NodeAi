// Wrapper CJS yang load ESM app via dynamic import
const { createRequire } = require('module');

exports.handler = async (event, context) => {
  const { default: serverless } = await import('serverless-http');
  const { default: app } = await import('../../apps/backend/src/app.js');
  const handler = serverless(app);
  return handler(event, context);
};
