const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

// Create tables
db.serialize(() => {
  // Existing table (if you already had one, keep it)
  db.run(`
    CREATE TABLE IF NOT EXISTS restaurant_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id TEXT,
      name TEXT,
      expected_open INTEGER,
      actual_open INTEGER,
      mismatch INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;