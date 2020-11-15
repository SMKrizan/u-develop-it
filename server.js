// npm packages ============================================================================================
// facilitates communication between front and back end
const express = require('express');
// enables connection to and SQL command execution via SQLite3 database, setting execution mode to 'verbose()' to produce messages in terminal regarding state of runtime which helps explain what SQLite component of app is doing
const sqlite3 = require('sqlite3').verbose();

//==========================================================================================================
// sets environment variable for host to access/run app
const PORT = process.env.PORT || 3001;
// server instantiation
const app = express();

// express middleware=======================================================================================
// converts incoming data into key:value pairings; "false" indicates data in a single layer (no nested data)
app.use(express.urlencoded({ extended: false }));
// parses JSON data into req.body object
app.use(express.json());

// routes =================================================================================================
// connects application to SQLite database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

// returns all data in candidate table using db.all() method; the callback function captures responses from the query in two variables: 'err'reports null if no errors, and 'rows' is the db query response; this method is the key component that allows SQL commands to be written in a Node.js application
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// get a single candidate
// db.get(`SELECT * FROM candidates WHERE id = 11`, (err, row) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// deletes a candidate; the 'run()' method will execute SQL query but not retrieve results; "?" is placeholder; the hard-coded "1" is an additional "param" argument provided to the placeholder (param arguments may also represent an array of values)
db.run(`DELETE FROM candidates WHERE id = ?`, ["1"], function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log(result, this, this.changes);
});

// create a candidate;
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function(err, result) {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// });

// default response (400: Not Found) for any other requests; make sure this follows all others 
app.use((req, res) => {
    res.status(404).end();
});

// starts server and indicates port location AFTER db connection is made ===========================================
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})