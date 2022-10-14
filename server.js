const fs = require('fs');
const express = require('express');
const shortid = require('shortid')
const util = require('util');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET * should return the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET /notes should return the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
  
// GET /api/notes should return the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};
// POST /api/notes should receive a new note to save on the request body, 
// -- add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {

    const { title, text} = req.body;

    if (title && text) {
        const newFeedback = {
            title,
            text,
            note_id: shortid.generate()
        };

        readAndAppend(newFeedback, 'db/db.json');
        const response = {
            status: 'success',
            body: newFeedback,
        };
        res.json(response);
  } else {
        res.json('Request body must contain a title and text.');
  }

});

app.listen(PORT, () => {
    console.log(`listening on PORT http://localhost:${PORT}`);
});