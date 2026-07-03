'use strict';

const Database = require('better-sqlite3');
const path = require('path');

// crea o abre la DB
const db = new Database(path.join(__dirname, 'nexus.db'));

// exporta la conexión
module.exports = db;