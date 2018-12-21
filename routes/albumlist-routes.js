const express = require('express');
const router = express.Router();
const Albumlist = require('../models/Albumlist');
// import Albumlist model so we can perform Albumlist.find, findByIdAndUpdate etc.


// All Albumlists List - Get Route - TESTED
router.get('/albumlists', (req, res, next) => {
  // this route.. keep in mind, is ACTUALLY /api/albumlists because we prefixed this ENTIRE file with /api.
  // /api found in app.js line 58.

    Albumlist.find()
      .then((allTheAlbumlists) => {

          res.json(allTheAlbumlists)
          // ONLY command we will do in this app in back end routes is RES.JSON. Since it is an API, we will not be using res.render or res.redirect since those are used for views/handlebars and the API will carry all of our data and json's for us to view.
          // Part 2 of this is - ensure we grab all the .json paths from the React side. keep in mind
      })
      .catch((err) => {
          res.json(err);
      })
});


// One Albumlist Details - Get Route - TESTED
router.get('/albumlist-details/:id', (req, res, next) => {
  // because we are making this route unique, with :id, not necessary to put at bottom of the file.
  // Ask Nick/Marcos if it is necessary since I prefer mine to not have /details.
    Albumlist.findById(req.params.id)
      // when ANY route requires id, specific instance of a model, use REQ.PARAMS.ID inside the function argument. It will find the single Albumlist in the database.
      .then((aAlbumlist) => {
        res.json(aAlbumlist);
          // ?? then render json for all the info about the Albumlist. this will reach out to the api for the target json's.
      })
      .catch((err) => {
          res.json(err);
      })
})


// in a pure express app w/o react or angular, to Create a New Albumlist or Object Instance, it involves a get route where a user sees a form to fill in information.
// then that form submits to a post route where the info is received and then a new instance is created.
// However, with an API and a REACT front end, we only need one route.. the POST route, no get route, since React takes care of the get route for us.
// The form the user will fill out will be in the React app, and we will have to retrofit the React app, so it can successfully make a post request using Axios to the post route we define below.



// ADD/Create a New Albumlist - Post Route - TESTED
// req.body postman testing - use body selector to enter all the new keys and values.
router.post('/albumlists/add-new', (req, res, next) => {
    Albumlist.create({
      // we will need to be sure when making the React app, we design a page that gives users the ability to make a post request to https://localhost:5000/api/Albumlists/add-new, and have to be sure that when we send the request from our React app, there are four things in the body of the request. they must be called theName, theCreator, theSongs[], and theTime.
      // this will be done with Axios.
      creator: req.user._id,
      // creator not needed to add as a key because it is surmised from user that is already logged in from the loggedinsession get route in user-routes.js.
      name: req.body.theName,
      albums: req.body.theAlbums,
      time: req.body.theTime
    })
    .then((response) => {
      // response is equivalent to response from React after the Albumlist is created in the database.
      res.json(response)
    })
    .catch((err) => {
      res.json(err);
    })
})


// 
// Edit an Albumlist - Post Route - 
router.post('/albumlist-edit/:id', (req, res, next) => {
    Albumlist.findByIdAndUpdate(req.params.id, {
      creator: req.user._id,
      // creator not needed to add as a key because it is surmised from user that is already logged in from the loggedinsession get route in user-routes.js.
      name: req.body.theName,
      albums: req.body.theAlbums,
      time: req.body.theTime
      // same as in the add a new Albumlist post route.
    })
    .then((response) => {
      if (response === null ) {
        res.json({ message: 'sorry no Albumlist found' });
        return;
      }
      // if there isn't an error, but we also can't find the instance with that id, then the response from the database will equal null. then we do an if statement saying if response === null then show a message. because this situation does not show a true console error.
        res.json([{ message: 'the Albumlist was successfully updated'}, response ])
        // after res.json, the message is an object within the argument, IF you want to console.log the response as well, then you must make the argument an array, object message being 0 index, response being 1 index.
        // res.json needs to take an array OR an object as the argument. to add a message as well, its an array, and the 2nd argument is response.
    })
    .catch((err) => {
      res.json(err.message);
    })
})


// Delete an Albumlist - Post Route - TESTED
router.post('/albumlist-delete/:id', (req, res, next) => {
    Albumlist.findByIdAndRemove(req.params.id)
      .then((deletedAlbumlist) => {
        if (deletedAlbumlist === null) {
          res.json({ message: 'sorry Albumlist not found' })
          // res.json takes an object, err or a custom one like message: .. { message: }
          return;
        }
        res.json([{ message: 'Albumlist successfully deleted'}, deletedAlbumlist])
      })
      .catch((err) => {
        res.json(err);
      })
})


module.exports = router;

// second step is to make the routes file.

// postman will test the API, while we're building the app.
// to test: enter 0route into top bar for postman, and add keys and test to see if in the browser a new json object is added, edited, deleted, etc depending on route being tested.

// cross origin request security - cors needs to be installed as well.

// Check with Nick on Edit routes quick
// ALL ROUTES NEED TO BE TESTED

// req.body and body in postman is for post routes where all the key/values need to be included, like add-new or edit.

// req.params and params in postman are for times when id is used, one particular instance is grabbed from the database.