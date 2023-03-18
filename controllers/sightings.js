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
            res.render('index', { title: 'My Form' , data:sightings});
    })

    return ret
};

// load the data for a specific sighting
exports.getSightingById = function (req,res,next) {
    Sighting.findById(req.params.sightingId, function(err,obj){
        if (err)
            console.log(err)
        else
            Chat.list_all(req,res,obj,req.params.sightingId);
            // res.render('sighting',{title:'View A sighting',data:obj, chats:chats});
    });
};






