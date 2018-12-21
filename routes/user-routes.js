const express      = require('express');
const router       = express.Router();

const passport     = require('passport');
const bcrypt       = require('bcryptjs');

const User         = require('../models/User');
// require the User model!!





// Register post route - TESTED
router.post('/signup', (req, res, next) => {
  console.log('sign up',req.params)
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    // ask nick/marcos Wednesday if res.status(400) is necessary or if res.json only is necessary.
    return;
  }

  // if(password.length < 7) {
  //     res.status(400).json({ message: 'Please ensure password is at least 8 characters long for security' });
  //     return;
  // }
  // UNCOMMENT ABOVE WHEN OUT OF TESTING

  User.findOne({ username }, (err, foundUser) => {

      if (err){
          res.status(500).json({ message: 'Username check incomplete.' });
          return;
      }

      if (foundUser) {
        res.status(400).json({ message: 'Username taken. Please choose another.' });
        return;
      }

      const salt      = bcrypt.genSaltSync(10);
      const hashPass  = bcrypt.hashSync(password, salt);

      const aNewUser = new User({
            username: username,
            password: hashPass
      });

      aNewUser.save(err => {
          if (err) {
            res.status(400).json({ message: 'Saving user to database incomplete' });
            return;
          }

          // automatically login a user after they signup. .login() here is the predefined passport method.
          req.login(aNewUser, (err) => {

            if (err) {
              res.status(500).json({ message: 'Login after signup incomplete' });
              return;
            }

            // Send the User's information to the front end (react side). 
            // We could also use res.status(200).json(req.user);
            res.json(aNewUser);
          });
      });
  });
});


// Login Post Route - TESTED
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    
    if (err) {
      res.status(500).json({ message: 'User authentication failed' });
      return;
    }

    // failureDetails contains the error messages, from our logic in "LocalStrategy" { message: '...' }.
    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    // now this part saves the user in the session so they are not inadvertently logged out.
    req.login(theUser, (err) => {
      if (err) {
        res.json({ message: 'Current session stopped' });
        return;
      }

      // we are now logged in based on previous logic. thus we can NOW use req.user.
      res.json(theUser);
    });
  })(req, res, next);
  // above - why the heck is this here!?
});


// Logout Post Route - TESTED
router.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport. is why it is used here.
  req.logout();
  res.json({ message: 'Log out sucess!' });
});

// Staying Logged In Route (React feature)


// LoggedInSession Get Route - TESTED
router.get('/loggedinsession', (req, res, next) => {
  // req.isAuthenticated() is defined by passport.
  if (req.isAuthenticated()) {
      res.json(req.user);
      // res.json refers to the user instance from the database being used to navigate the site. a json is a js object that has been created in the database, and is saved there. this says as long as authentication has happened, that json instance trying to log in can navigate the site.
      return;
  }
  res.status(500).json({ message: 'Unauthorized' });
});
// Should testing the loggedinsession pull up html and not a message in Postman?



module.exports = router;

// \,\,\,\, ALL ROUTES TESTED WITH POSTMAN

// req.body is only for post requests.