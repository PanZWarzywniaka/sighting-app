let mongoose = require('mongoose');

let Schema = mongoose.Schema;

/**
 * Schema for chat,
 * each chat belongs to sighting,
 * is created by username,
 * has message contend,
 * has timestamp of when was created
 */
let ChatSchema = new Schema(
    {
        sightingId: {type: Schema.Types.ObjectId, ref: 'Sighting', required: true},
        username: {type: String, required: true, max: 100},
        message: {type: String, required: true},
        created_at: {type: Date, required: true},
    }
);


ChatSchema.set('toObject', {getters: true});
let Chat = mongoose.model('Chat', ChatSchema);

// make this available to our users in our Node applications
module.exports = Chat;