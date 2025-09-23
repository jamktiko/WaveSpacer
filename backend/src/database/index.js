// src/db/index.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // lataa .env-tiedoston

// aws test push modify 2

// Luo pool, joka hallitsee useita yhteyksiä samaan aikaan
const pool = mysql.createPool({
  host: process.env.DB_HOST, // esim. RDS endpoint tai localhost
  user: process.env.DB_USER, // DB käyttäjä
  password: process.env.DB_PASS, // DB salasana
  database: process.env.DB_NAME, // tietokanta
  waitForConnections: true, // jos kaikki yhteydet varattuja, odota
  connectionLimit: 10, // max yhtäaikaisia yhteyksiä
  queueLimit: 0, // ei rajaa jonossa olevia yhteyksiä
});

module.exports = pool;
