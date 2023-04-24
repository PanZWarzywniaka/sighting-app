let bodyParser = require("body-parser");
//let req = require('request');
let Sighting = require('../models/sightings');
let Chat = require("./chats");
let path = require('path');


exports.create = function (req, res) {
    let userData = req.body;
    // splits location field into longitude and latitude
    let loc = req.body.location.split(",");
    let path = req.file.path.replace("public","")
    
    let sighting = new Sighting({
        identification: userData.identification,
        description: userData.description,
        username: userData.username,
        last_seen: userData.last_seen,
        location: {
            type: "Point",
            coordinates: [parseFloat(loc[0]), parseFloat(loc[1])]
        },
        img: path
    });

    sighting.save(function (err, results) {
        if (err) {
            console.log(err)
            res.status(500).send(err);
        }
        res.redirect('/sightings');
    });
};

exports.list_all = function(req, res) {
    let ret = []
    Sighting.find({},(err,sightings) => {
        if (err)
            console.log(err)
        else
            res.render('index', { title: 'Bird Sightings' , data:sightings});
    })

    return ret
};

exports.list_nearby = function(req, res, next) {
    // get position of current user to find the nearest sightings
    let userLocation=[-1.4701,53.3811];
    Sighting.aggregate
    ([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: userLocation
                },
                distanceField: "dist_calculated"
            }
        }
    ])
        .exec(function (err, sightings) {
            if (err) {
                return next(err)
            }
            res.render('index', {title: 'Bird Sightings', data: sightings});
        });
};


exports.list_recent = function(req, res, next) {
    Sighting.find({}).sort({last_seen:-1})
    .exec(function(err,sightings){
            if (err) {
                return next(err)
            }
            else 
                res.render('index',{title: 'Bird Sightings', data: sightings})
        })
};





exports.list_mine = function(req, res, next) {
    let name = req.body.username;
    console.log(name);
    Sighting.find({username: name})
    
    .exec(function(err,sightings){
        if (err) {
            return next(err)
        }
        else 
            res.render('index',{title: 'Bird Sightings', data: sightings})
    })

};



// load the data for a specific sighting
exports.getSightingById = function (req,res,next) {
    Sighting.findById(req.params.sightingId, function(err,obj){
        if (err)
            console.log(err)
        else
            Chat.list_all(req,res,obj,req.params.sightingId);
    });
};






