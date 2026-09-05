// CJS wrapper — pakai dynamic import() untuk load ESM modules
// node_bundler="none": file tidak di-bundle, ESM tetap ESM
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Resolve path absolut ke backend app
    const backendPath = path.resolve(__dirname, '../../apps/backend');
    const appPath = path.join(backendPath, 'src/app.js');
    
    // Import serverless-http dari node_modules backend
    const serverlessPath = path.join(backendPath, 'node_modules/serverless-http/lib/index.js');
    
    const { default: serverless } = await import(serverlessPath);
    const { default: app } = await import(appPath);
    
    const handler = serverless(app);
    return handler(event, context);
  } catch (err) {
    console.error('[Function Error]', err.message, err.stack?.split('\n').slice(0,3).join(' | '));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
