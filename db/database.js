// npm packages ============================================================================================
// facilitates communication between front and back end
// enables connection to and SQL command execution via SQLite3 database, setting execution mode to 'verbose()' to produce messages in terminal regarding state of runtime which helps explain what SQLite component of app is doing
const sqlite3 = require('sqlite3').verbose();

// connects application to SQLite database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

module.exports = db;