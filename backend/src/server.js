const { loadSecrets } = require('./config/loadSecrets');
const { initPool } = require('./database');
const app = require('./app');

async function startServer() {
  await loadSecrets();
  await initPool(); // nyt luodaan tietokantayhteys vasta secretsien jälkeen

  const PORT = process.env.PORT || 8888;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
