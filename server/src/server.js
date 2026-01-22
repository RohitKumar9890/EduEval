import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { checkRequiredEnvVars } from './utils/checkEnvVars.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Check environment variables first
  // eslint-disable-next-line no-console
  console.log('\n🔍 Checking environment variables...');
  checkRequiredEnvVars();

  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`EduEval API server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
