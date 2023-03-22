let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ChatSchema = new Schema(
    {
        sightingId: {type: Schema.Types.ObjectId, ref: 'Sighting', required: true},
        username: {type: String, required: true, max: 100},
        message: {type: String, required: true},
        created_at: {type: Date, required: true},
    }
);



ChatSchema.set('toObject', {getters: true});


// the schema is useless so far
// we need to create a model using it
let Chat = mongoose.model('Chat', ChatSchema);

// make this available to our users in our Node applications
module.exports = Chat;