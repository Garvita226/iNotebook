const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')

connectToMongo();

const app = express();
const port = 5000;

// Fix cors error
app.use(cors())

// For getting body of json from post request
app.use(express.json());

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// Listening on port
app.listen(port, () => {
    console.log(`iNotebook backend listening on port ${port}`);
})