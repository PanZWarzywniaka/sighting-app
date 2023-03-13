let bodyParser = require("body-parser");
//let req = require('request');
let Sighting = require('../models/sightings');
let path = require('path');


exports.create = function (req, res) {
    let userData = req.body;
    // splits location field into longitude and latitude
    let loc = req.body.location.split(",");
    let sighting = new Sighting({
        identification: userData.identification,
        description: userData.description,
        username: userData.username,
        last_seen: userData.last_seen,
        location: {
            type: "Point",
            coordinates: [parseFloat(loc[0]), parseFloat(loc[1])]
        },
    });

    sighting.save(function (err, results) {
        if (err) {
            console.log(err)
            res.status(500).send(err);
        }

    });
    res.redirect('/');
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






