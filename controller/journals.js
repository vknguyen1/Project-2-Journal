// Setup Dependencies
const express = require('express');
const journal = require('../models/journal');
const journalRouter = express.Router();

const { Calendar } = require('@fullcalendar/core');
const dayGridPlugin = require('@fullcalendar/daygrid');
const timeGridPlugin = require('@fullcalendar/timegrid');
const listPlugin = require('@fullcalendar/list');

// import models
const Journal = require('../models/journal');

// index;
journalRouter.get('/', (req, res) => {
  Journal.find({}, (err, journalEntry) => {
    res.render('journal/index.ejs', {
      journalEntry,
      Calendar,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    });
  });
});

journalRouter.get('/journals', (req, res) => {
  Journal.find({}, (err, journalEntry) => {
    res.send(journalEntry);
  });
});

// journalRouter.get('/', (req, res) => {
//   Note.find({}, (err, journal) => {
//     res.send(journal); //res.send can send text data or json data, but essentially a HTTP response
//   });
// });

// new
journalRouter.get('/new', (req, res) => {
  res.render('journal/new.ejs');
});
// delete

journalRouter.delete('/journal/:id', (req, res) => {
  Journal.findByIdAndDelete(req.params.id, (err, deletedEntry) => {
    res.redirect('/journal');
  });
});

// update
journalRouter.put('/journal/:id', (req, res) => {
  if (req.body.taskIsCompleted === 'on') {
    req.body.taskIsCompleted = true;
  } else {
    req.body.taskIsCompleted = false;
  }
  req.body.taskIsCompleted = !!req.body.taskIsCompleted;
  journal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, journalEntry) => {
      res.redirect(`/journal/${req.params.id}`);
      console.log(req.body.taskIsCompleted);
    },
  );
});

// create
journalRouter.post('/journal', (req, res) => {
  console.log(req.body);
  Journal.create(req.body, (err, newEntry) => {
    res.redirect('/journal');
  });
});

// edit
journalRouter.get('/journal/:id/edit', (req, res) => {
  Journal.findById(req.params.id, (err, entry) => {
    res.render('./journal/edit.ejs', { entry });
    console.log(entry);
  });
});

// show
journalRouter.get('/journal/:id', (req, res) => {
  Journal.findById(req.params.id, (err, journalEntry) => {
    res.render('journal/show.ejs', { journalEntry });
  });
});

// export the router object
module.exports = journalRouter;
