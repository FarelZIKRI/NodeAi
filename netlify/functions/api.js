const path = require('path');

exports.handler = async (event, context) => {
  try {
    const appPath = path.resolve(__dirname, '../../apps/backend/src/app.js');
    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import(appPath);

    // binary: false agar body tidak di-encode ulang
    // request: sinkronisasi agar body tidak double-parse
    const handler = serverless(app, {
      request(req) {
        // Jika body sudah string (dari Netlify event), biarkan apa adanya
        // Jangan parse ulang — Better Auth butuh raw stream
        if (typeof req.body === 'object' && req.body !== null) {
          const bodyStr = JSON.stringify(req.body);
          req.body = bodyStr;
          req.headers['content-length'] = Buffer.byteLength(bodyStr).toString();
        }
      }
    });
    return handler(event, context);
  } catch (err) {
    console.error('[Function Error]', err.message, err.stack?.split('\n').slice(0, 3).join(' | '));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
