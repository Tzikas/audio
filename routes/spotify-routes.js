const express = require('express');
const router = express.Router();
const axios  = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const Albumlist = require('../models/Albumlist');
// import Albumlist model so we can perform Albumlist.find, findByIdAndUpdate etc.
const Playlist = require('../models/Playlist');
// import Playlist model so we can perform Playlist.find, findByIdAndUpdate etc.

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.SECRETCLIENTID,
  redirectUri: 'http://localhost:5000/viewalbums'
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((err) => {
    console.log('Something went wrong when retrieving an access token', err);
});




router.post('/artists', (req, res, next) => {
  // console.log("*************", req.body.artistInput)
  spotifyApi.searchArtists(req.body.artistInput)
    .then(result => {
      console.log(result.body.artists.items);
      res.json({data: result.body.artists.items});
      // don't think I need the res.render here because I'm using React.
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then((result) => {
      console.log("the albums info ============== ", result.body.items);
      res.json({data: result.body.items});
      // body is storing information that is returned from spotify. then we choose which data we want.
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then((result) => {
      console.log("track info ---------- ", result.body.items[0]);
      res.json({data: result.body.items});
    })
    .catch((err) => {
      next(err);
    });
});


    // whatever request is used, .body is used to grab the information from the api
   
// Add here spotify routes - and test them all in postman




//var theSplitURL = req.body.theUrl.split('/')

//spotifyApi.getArtist(theSplitURL[theSplitURL.length-1])


module.exports = router;