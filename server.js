// DEPENDENCEIS
const express = require('express');
require('dotenv').config();
const journalsRouter = require('./controller/journals');
const mongoose = require('mongoose');
const morgan = require('morgan'); // morgan designed to read, not modify information
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const journalController = require('./controller/journals');
const userController = require('./controller/users');
const session = require('express-session');

// initialize express
const app = express();
app.use(express.json());
// Configure APP Settings
const { PORT, DATABASE_URL, SECRET } = process.env;

// connect database
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(error.message + 'mongoDB error!');
});

db.on('connected', () => {
  console.log('mongoDB connected');
});

db.on('disconnected', () => {
  console.log('mongoDB disconnected');
});

// mount middleware
app.use(express.urlencoded({ extended: false })); //urlencoded allows us to read top level of HTML5 form and nested input values
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(morgan('dev'));

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(async function (req, res, next) {
  if (req.session && req.session.user) {
    const user = await require('./models/user').findById(req.session.user);
    res.locals.user = user;
  } else {
    res.locals.user = null;
  }
  next();
});

// Mount Route
app.get('/', (req, res) => {
  res.redirect('/journal');
});

// router middleware
app.use('/journal', journalController);
app.use('/users', userController);

app.use('/', journalsRouter);
app.set('view engine', 'ejs');

// Port Listening
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}...`);
});
