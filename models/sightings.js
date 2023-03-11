let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SightingSchema = new Schema(
    {
        descritpion: {type: String, required: true, max: 1000},
        username: {type: String, required: true, max: 100},
        last_seen: {type: Date, required: true},
        location: {type: String, required: true}
    }
);



SightingSchema.set('toObject', {getters: true});


// the schema is useless so far
// we need to create a model using it
let Sighting = mongoose.model('Sighting', SightingSchema);

// make this available to our users in our Node applications
module.exports = Sighting;