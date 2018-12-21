const mongoose = require('mongoose');
const Schema   = mongoose.Schema;



const playlistSchema = new Schema({
      creator: { type: Schema.Types.ObjectId, ref:'User' },
      name: String,
      songs: [],
      time: Number
      // look at duration of each song in playlist made from user, look at movies assignment from module 1, and the hours to minute function on github for reference for total time.
      // stringify the time from songs, 0 index into 1 array as minutes, then 1 index as an array with seconds.
})

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;

// first make models in express api app.

// IF TIME ADD AN ARTISTLIST model