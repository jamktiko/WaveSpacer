//Lataa .env aina ensin, jos tiedosto on olemassa
try {
  require('dotenv').config();
  console.log('.env loaded (if present)');
} catch (err) {
  console.warn('Could not load .env (might be production environment)');
}

const { loadSecrets } = require('./config/loadSecrets');
const pool = require('./database/index');
const { startCronJobs } = require('../src/jobs/recentlyPlayedJob');

async function startServer() {
  //Ladataan AWS Secrets vain jos ollaan tuotannossa
  if (process.env.NODE_ENV === 'production') {
    await loadSecrets();
    console.log('Secrets loaded from AWS Secrets Manager');
  } else {
    console.log('Using local .env configuration');
  }

  //Tuodaan app vasta nyt, kun kaikki ympäristömuuttujat on varmasti paikallaan
  const app = require('./app');

  //Alustetaan tietokantayhteys
  await pool.initPool();

  //Käynnistetään palvelin
  const PORT = process.env.PORT || 80;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at port ${PORT}`);
  });

  startCronJobs();
}

startServer();
