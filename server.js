// npm packages ============================================================================================
const express = require('express');
// local modules============================================================================================
const db = require('./db/database.js');
//==========================================================================================================
// sets environment variable for host to access/run app
const PORT = process.env.PORT || 3001;
// server instantiation
const app = express();

const apiRoutes = require('./routes/apiRoutes');

// express middleware=======================================================================================
// converts incoming data into key:value pairings; "false" indicates data in a single layer (no nested data)
app.use(express.urlencoded({ extended: false }));
// parses JSON data into req.body object
app.use(express.json());
// accepts and redirects for api routes
app.use('/api', apiRoutes);

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