require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
// require cors as our security package so our API is enabled to receive server side requests as long as they're coming from this specific location - the react app.

const session      = require('express-session');
const passport     = require('passport');

const SpotifyWebApi = require('spotify-web-api-node');

require('./config/passport-stuff');
// requires configuration passport code we put in the config folder, passport-stuff file.

mongoose
  .connect('mongodb://audio1:audio1@ds141704.mlab.com:41704/audio', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// // Spotify API Middleware
// var clientId = process.env.CLIENTID; 
// // client ID above
// var clientSecret = process.env.CLIENTSECRETID;
// // your secret
// var redirect_uri = 'REDIRECT_URI';
// // your redirect uri

// ERROR ABOVE ^^^^^
 
// const spotifyApi = new SpotifyWebApi({
//   clientId : clientId,
//   clientSecret : clientSecret
// });

// // Retrieve Access Token
// spotifyApi.clientCredentialsGrant()
//   .then((data) => {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   })
//     .catch((err) => {
//     console.log('error when retrieving access token', err);
//   });



app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://audiofy.surge.sh', '*']
}));
// cors is the security feature, thus it will accept requests as long as they come from localhost:3000 which is the route that the react app will have.

const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/user-routes');
app.use('/api', userRoutes);
// we will prefix all of our express routes with '/api'
// so none of our React routes conflict with these routes.

const playlistRoutes = require('./routes/playlist-routes');
app.use('/api', playlistRoutes);

const albumlistRoutes = require('./routes/albumlist-routes');
app.use('/api', albumlistRoutes);

const spotifyRoutes = require('./routes/spotify-routes');
app.use('/api', spotifyRoutes);

module.exports = app;
