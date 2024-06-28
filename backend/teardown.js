// Open the database to use
const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('internal.db'), {fileMustExist: true});

// Delete the appointments table from the database
let query = `DROP TABLE IF EXISTS appointments`;
db.exec(query);

// Delete the patients table from the database
query = `DROP TABLE IF EXISTS patients`;
db.exec(query);

// Delete teh clinicians table from the database
query = `DROP TABLE IF EXISTS clinicians`;
db.exec(query);

// Close connection to the database
db.close();