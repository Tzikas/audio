const mongoose = require('mongoose');
const Schema   = mongoose.Schema;



const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    playlists: { type: Schema.Types.ObjectId, ref:'Playlist' },
    albumlists: { type: Schema.Types.ObjectId, ref:'Albumlist' },
    bio: String,
    hometown: String,
    favoriteGenre: String,
    image: String,
    admin: { type: Boolean, default: false}

})

const User = mongoose.model('User', userSchema);

module.exports = User;

// first make a model in express api app.

// IF TIME ADD AN ARTISTLIST model