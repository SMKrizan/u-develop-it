// npm package facilitates communication between front and back end
const express = require('express');
// sets environment variable for host to access/run app
const PORT = process.env.PORT || 3001;
// server instantiation
const app = express();

// express middleware
// converts incoming data into key:value pairings; "false" indicates data in a single layer (no nested data)
app.use(express.urlencoded({ extended: false }));
// parses JSON data into req.body object
app.use(express.json());

// // Confirming connection to Express.js server
// app.get('/', (req, res) => {
//     res.json({
//         message: "Hello World"
//     });
// });

// Default response (400: Not Found); make sure this follows all other requests 
app.use((req, res) => {
    res.status(404).end();
});

// starts server and indicates port location
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});