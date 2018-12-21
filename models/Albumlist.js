const mongoose = require('mongoose');
const Schema   = mongoose.Schema;



const albumlistSchema = new Schema({
      creator: { type: Schema.Types.ObjectId, ref:'User' },
      name: String,
      albums: [],
      time: Number
})

const Albumlist = mongoose.model('Albumlist', albumlistSchema);

module.exports = Albumlist;

// first make models in express api app.

// IF TIME ADD AN ARTISTLIST model