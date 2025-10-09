const mysql = require('mysql2/promise');

let pool; // alustetaan tyhjänä

async function initPool() {
  if (pool) return pool; // jos jo luotu, palauta se

  // varmista että tarvittavat ympäristömuuttujat ovat olemassa
  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASS ||
    !process.env.DB_NAME
  ) {
    throw new Error('Database environment variables not loaded');
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('MySQL pool created');
  return pool;
}

// Palautetaan pool niin että muu koodi voi käyttää sitä normaalisti require:llä
module.exports = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (!pool) {
        throw new Error(
          'Database pool not initialized. Call initPool() after loading secrets.'
        );
      }
      return pool[prop];
    },
  }
);

module.exports.initPool = initPool;
