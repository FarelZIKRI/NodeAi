import serverless from 'serverless-http';
import app from '../../apps/backend/src/app.js';

export const handler = serverless(app);
