const Database = require("better-sqlite3");
const path = require("path");

// base de datos directa en carpeta database
const db = new Database(path.join(__dirname, "nexus.db"));

db.pragma("journal_mode = WAL");

db.prepare(`
CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license TEXT UNIQUE NOT NULL,
    duration INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    expiresAt INTEGER,
    hwid TEXT,
    active INTEGER DEFAULT 1,
    banned INTEGER DEFAULT 0
)
`).run();

module.exports = db;