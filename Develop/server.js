const fs = require('fs');
const express = require('express');

const data = require('./db/db.json');

const PORT = 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET * should return the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /notes should return the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

// GET /api/notes should return the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => res.json(data));

// POST /api/notes should receive a new note to save on the request body, 
// -- add it to the db.json file, and then return the new note to the client.


app.listen(PORT, () => {
    console.log(`listening on PORT http://localhost:${PORT}`);
});