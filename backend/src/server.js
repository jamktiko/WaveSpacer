const { loadSecrets } = require('./config/loadSecrets');
const pool = require('./database'); // saa mukaan myös initPool
const app = require('./app');

async function startServer() {
  // Kehityksessä käytetään .env
  if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
    console.log('Local .env loaded');
  } else {
    await loadSecrets();
  }

  // Alustetaan tietokantayhteys ennen kuin app käynnistyy
  await pool.initPool();

  const PORT = process.env.PORT || 8888;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at port ${PORT}`);
  });
}

startServer();
