var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CharacterSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        dob: {type: Number}

    }
);

// Virtual for a character's age
CharacterSchema.virtual('age')
    .get(function () {
        var currentDate = new Date().getFullYear();
        var result= currentDate - this.dob;
        return result;
    });

CharacterSchema.set('toObject', {getters: true, virtuals: true});

//On some combionations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Character = mongoose.model('Character', CharacterSchema);

// make this available to our users in our Node applications
module.exports = Character;