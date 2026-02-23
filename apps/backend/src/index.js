import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Backend server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
