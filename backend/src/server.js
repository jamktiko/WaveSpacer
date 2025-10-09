const { loadSecrets } = require('./config/loadSecrets');
const app = require('./app');

async function startServer() {
  await loadSecrets();

  const PORT = process.env.PORT;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at port ${PORT}`);
  });
}

startServer();
