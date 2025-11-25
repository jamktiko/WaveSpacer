//test3

const fs = require('fs');
const https = require('https');
const http = require('http');

try {
  require('dotenv').config({ override: false });
  console.log('.env loaded (if present)');
} catch (err) {
  console.warn('Could not load .env (might be production environment)');
}

const { loadSecrets } = require('./config/loadSecrets');
const pool = require('./database/index');

async function startServer() {
  // Load Aws Secrets if we are in production

  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
  } else {
    console.log('Using local .env configuration');
  }

  const app = require('./app');
  const { startCronJobs } = require('../src/jobs/recentlyPlayedJob');

  await pool.initPool();

  try {
    const PORT = process.env.PORT || 8888;
    http.createServer(app).listen(8888, '0.0.0.0', () => {
      console.log(`HTTP server running on port ${8888}`);
    });
  } catch (err) {
    console.error('Could not start HTTP server:', err.message);
  }

  startCronJobs();
}

startServer();
