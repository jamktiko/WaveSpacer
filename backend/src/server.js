//test2

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
  // Ladataan AWS Secrets vain jos ollaan tuotannossa
  console.log('NODE ENV:' + process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
    console.log('Secrets loaded from AWS Secrets Manager');
    console.log(
      'Spotify client id?',
      process.env.SPOTIFY_CLIENT_ID ? 'found' : 'missing'
    );
    console.log(
      'Frontend URL:',
      process.env.FRONTEND_URL ? 'found' : 'missing'
    );
  } else {
    console.log('Using local .env configuration');
  }

  const app = require('./app');
  const { startCronJobs } = require('../src/jobs/recentlyPlayedJob');

  await pool.initPool();

  if (process.env.NODE_ENV === 'production') {
    try {
      const key = fs.readFileSync('/home/ssm-user/myserts/privatekey.pem');
      const cert = fs.readFileSync('/home/ssm-user/myserts/server.crt');

      https.createServer({ key, cert }, app).listen(443, '0.0.0.0', () => {
        console.log('HTTPS server running on port 443');
      });
    } catch (err) {
      console.error('Could not start HTTPS server:', err.message);
    }
  }
  // Development: HTTP
  else {
    const PORT = process.env.PORT || 8888;
    http.createServer(app).listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP server running on port ${PORT}`);
    });
  }

  startCronJobs();
}

startServer();
