const usersRouter = require('express').Router();
const User = require('../models/user');
const Journal = require('../models/journal');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// router middleware

// login GET route
usersRouter.get('/login', (req, res) => {
  res.render('./users/login.ejs', { err: '' });
});

// login POST route - authenticate/login a user
usersRouter.post('/login', (req, res) => {
  // step 1 - find the user in the database by email/username
  User.findOne({ email: req.body.email }, '+password', (err, foundUser) => {
    // step 1a - if the user is not found, respond with an error saying that the user does not exist
    if (!foundUser)
      return res.render('./users/login.ejs', {
        err: `Account for ${req.body.email} doesn't exist`,
      });
    // step 2 - assuming we've found the user, now we compare passwords - plain text === password digest
    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      // step 2a - if there is not a match, respond with an error saying Invalid Credentials
      return res.render('./users/login.ejs', { err: 'Invalid credentials' });
    }
    // step 3 assuming everything is good, we create a session and redirect to user profile page
    req.session.user = foundUser._id;
    res.redirect('/users/profile');
  });
});

// signup GET route - render the signup form
usersRouter.get('/signup', (req, res) => {
  res.render('./users/signup.ejs', { err: '' });
});

// signup POST route - create a new user
usersRouter.post('/signup', (req, res) => {
  if (req.body.password.length < 5) {
    return res.render('./users/signup.ejs', {
      err: 'Password must be at least 5 characters long',
    });
  }
  const hash = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(SALT_ROUNDS),
  );
  req.body.password = hash;
  User.create(req.body, (error, user) => {
    if (error) {
      res.render('./users/signup.ejs', { err: 'Email already taken' });
    } else {
      req.session.user = user._id; // this is a login
      res.redirect('/users/profile');
    }
  });
});

usersRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/login');
  });
});

// // profile GET route - find the logged in user in our db and render user profile
usersRouter.get('/profile', (req, res) => {
  User.findById(req.session.user, (err, user) => {
    res.render('./users/profile.ejs', { user });
  });
});

module.exports = usersRouter;
