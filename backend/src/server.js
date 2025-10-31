//Lataa .env aina ensin, jos tiedosto on olemassa

//test2

try {
  require('dotenv').config({ override: false });
  console.log('.env loaded (if present)');
} catch (err) {
  console.warn('Could not load .env (might be production environment)');
}

const { loadSecrets } = require('./config/loadSecrets');
const pool = require('./database/index');

async function startServer() {
  //Ladataan AWS Secrets vain jos ollaan tuotannossa
  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
    console.log('Secrets loaded from AWS Secrets Manager');
    console.log(
      'Spotify client id?',
      process.env.SPOTIFY_CLIENT_ID ? '✅ found' : '❌ missing'
    );
    console.log(
      'Frontend URL:',
      process.env.FRONTEND_URL ? '✅ found' : '❌ missing'
    );
  } else {
    console.log('Using local .env configuration');
  }

  //Tuodaan app vasta nyt, kun kaikki ympäristömuuttujat on varmasti paikallaan
  const app = require('./app');
  const { startCronJobs } = require('../src/jobs/recentlyPlayedJob');

  //Alustetaan tietokantayhteys
  await pool.initPool();

  //Käynnistetään palvelin
  const PORT = process.env.PORT || 443;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at port ${PORT}`);
  });

  startCronJobs();
}

startServer();
