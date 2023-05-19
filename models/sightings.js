let mongoose = require('mongoose');

let Schema = mongoose.Schema;

/**
 * Schema for Sighting,
 * each sighting has set identification, name of the bird species
 * has description
 * has username to store author
 * has timestamp when bird was last seen
 * has location object that stores longitude and latitude when was created
 * has base64 representation of image
 */
let SightingSchema = new Schema(
    {
        identification: {type: String, required: true},
        description: {type: String, required: true, max: 1000},
        username: {type: String, required: true, max: 100},
        last_seen: {type: Date, required: true},
        location: {
            type: { type: String },
            coordinates: []
        },
        img: {type: String}
    }
);



SightingSchema.set('toObject', {getters: true});
// Able to query based on coordinates
SightingSchema.index({ "location": "2dsphere" });


let Sighting = mongoose.model('Sighting', SightingSchema);

// make this available to our users in our Node applications
module.exports = Sighting;