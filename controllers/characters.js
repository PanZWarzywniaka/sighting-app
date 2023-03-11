var bodyParser = require("body-parser");
//var req = require('request');
var Character = require('../models/characters');
var path = require('path');


exports.create = function (req, res) {
    var userData = req.body;
    var character = new Character({
        first_name: userData.firstname,
        family_name: userData.lastname,
        dob: userData.year
    });

    character.save(function (err, results) {
        if (err) {
            console.log(err)
            res.status(500).send('Invalid data!');
        }
            
    //ntent-Type', 'application/json');
       // res.send(JSON.stringify(character));
        res.json({character: character});
    });
};






