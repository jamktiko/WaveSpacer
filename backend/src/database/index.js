const mysql = require('mysql2/promise');
require('dotenv').config(); // lataa .env-tiedoston

// Luo pool, joka hallitsee useita yhteyksiä samaan aikaan
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, // jos kaikki yhteydet varattuja, odota
  connectionLimit: 10, // max yhtäaikaisia yhteyksiä
  queueLimit: 0, // ei rajaa jonossa olevia yhteyksiä
});

module.exports = pool;
