let bodyParser = require("body-parser");
//let req = require('request');
let Sighting = require('../models/sightings');
let path = require('path');


exports.create = function (req, res) {
    let userData = req.body;
    let sighting = new Sighting({

        descritpion: userData.descritpion,
        username: userData.username,
        last_seen: userData.last_seen,
        location: userData.location
    });

    sighting.save(function (err, results) {
        if (err) {
            console.log(err)
            res.status(500).send(err);
        }
            
        res.json({sighting: sighting});
    });
};

exports.find = function(req, res) {
    let ret = []
    Sighting.find({},(err,sightings) => {
        if (err){
            console.log(err)
        } else {
            ret = sightings
            console.log(`In controler ${ret}`);
            res.render('index', { title: 'My Form' , data:sightings});
        }
    })

    return ret
};






