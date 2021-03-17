// AS A small business owner
// I WANT to be able to write and save notes
// SO THAT I can organize my thoughts and keep track of tasks I need to complete

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column


const express = require('express');
const app = express();
const path = require("path");
const router = express.Router();
const { notes, hash } = require("./db/db.json");
const fs = require("fs");

let flag = false;
let stored;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// instructs server to make certain files readily available and to not gate it behind a server endpoint
app.use(express.static('public'));

router.get("/api/notes", (req, res) => {
  let results = notes; 
  console.log(results);
    res.json(results);
})

router.get('/notes', (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname + "/public/notes.html"));
  });

router.get('/', (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname + "/public/index.html"));

  });

  router.post('/api/notes', (req, res) => {
    // if any data in req.body is incorrect, send 400 error back
    const note = req.body;
    let updateHash = (flag)?stored: hash;
    console.log(typeof updateHash);
    if (hash[3] === "9") {
      if (hash[2]=== "9") {
        updateHash = `N${parseInt(updateHash[1]) + 1}00`
      } else {
        updateHash = `N${updateHash[1]}${parseInt(updateHash[2]) + 1}0`
      }
    } else {
      updateHash = `N${updateHash[1]}${updateHash[2]}${parseInt(updateHash[3]) + 1}`
    }

    note.id = updateHash;
    stored = updateHash;
    flag = true;

    notes.push(note);
    console.log(updateHash);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ hash: updateHash, notes: notes }, null, 2)
    );
      res.json(note);
  });

app.use('/', router);
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });