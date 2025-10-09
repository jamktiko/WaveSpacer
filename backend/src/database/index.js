const mysql = require('mysql2/promise');

let pool = null;

async function initPool() {
  if (pool) return pool;

  if (!process.env.DB_HOST) {
    throw new Error('DB_HOST not set. Call loadSecrets() before initPool().');
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

  console.log('Database pool initialized');
  return pool;
}

// Proxy palauttaa oikean metodin (initPool tai poolin metodit)
const poolProxy = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === 'initPool') return initPool;

      if (!pool) {
        throw new Error(
          'Database pool not initialized. Call initPool() after loading secrets.'
        );
      }

      return pool[prop];
    },
  }
);

module.exports = poolProxy;
