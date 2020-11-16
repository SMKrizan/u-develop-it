// npm packages ============================================================================================
// facilitates communication between front and back end
const express = require('express');
// enables connection to and SQL command execution via SQLite3 database, setting execution mode to 'verbose()' to produce messages in terminal regarding state of runtime which helps explain what SQLite component of app is doing
const sqlite3 = require('sqlite3').verbose();

// local modules============================================================================================
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// deletes a candidate; the 'run()' method will execute SQL query but not retrieve results; "?" is placeholder; the hard-coded "1" is an additional "param" argument provided to the placeholder (param arguments may also represent an array of values)
app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// create a candidate;
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    // database call for candidate creation
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?, ?, ?)`;
    // user data collected in req.body
    const params = [body.first_name, body.last_name, body.industry_connected];
    // 'run()' method allows execution of prepared SQL statement bound to 'this' (ES5 function, not arrow function, to use 'this')
    db.run(sql, params, function (err, result) {
        // response
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});


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