const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite'
    },
    campsites : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite'
    }],
});

const Favorite = mongoose.model('Favorite',favoriteSchema)

module.exports = Favorite