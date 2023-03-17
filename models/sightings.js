let mongoose = require('mongoose');

let Schema = mongoose.Schema;

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
        
        img: {type: String, required: true}
    }
);



SightingSchema.set('toObject', {getters: true});
// Able to query based on coordinates
SightingSchema.index({ "location": "2dsphere" });


// the schema is useless so far
// we need to create a model using it
let Sighting = mongoose.model('Sighting', SightingSchema);

// make this available to our users in our Node applications
module.exports = Sighting;