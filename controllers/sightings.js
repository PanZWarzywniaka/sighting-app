let bodyParser = require("body-parser");
const https = require('https')
//let req = require('request');
let Sighting = require('../models/sightings');
let Chat = require("./chats");
let path = require('path');


exports.create = function (req, res) {
    let userData = req.body;
    // splits location field into longitude and latitude
    let loc = req.body.location.split(",");
    let path = null;
    if (req.file !== undefined)
        path = req.file.path.replace("public", "");

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

exports.list_all = function (req, res) {
    let ret = []
    Sighting.find({}, (err, sightings) => {
        if (err)
            console.log(err)
        else
            res.render('index', { title: 'Bird Sightings', data: sightings });
    })

    return ret
};

exports.list_nearby = function (req, res, next) {
    // get position of current user to find the nearest sightings
    let userLocation = [-1.4701, 53.3811];
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
            res.render('index', { title: 'Bird Sightings', data: sightings });
        });
};


exports.list_recent = function (req, res, next) {
    Sighting.find({}).sort({ last_seen: -1 })
        .exec(function (err, sightings) {
            if (err) {
                return next(err)
            }
            else
                res.render('index', { title: 'Bird Sightings', data: sightings })
        })
};





exports.list_mine = function (req, res, next) {
    let name = req.body.username;
    console.log(name);
    Sighting.find({ username: name })

        .exec(function (err, sightings) {
            if (err) {
                return next(err)
            }
            else
                res.render('index', { title: 'Bird Sightings', data: sightings })
        })

};


function queryBirdInfoFromDBPedia(req, res, obj) {
    let identification = obj['identification']
    const sparqlQuery = `SELECT  ?wiki_link ?image_link  (REPLACE(?abstract, "@en", "") AS ?abstract) 
    WHERE {
      ?dbpedia_link rdf:type dbo:Bird ;
                    foaf:isPrimaryTopicOf ?wiki_link ;
                    dbp:name "${identification}"@en  ;
                    dbo:abstract ?abstract ;
                    dbo:thumbnail ?image_link .
      FILTER(lang(?abstract) = 'en')
    }
    `;

    const options = {
        hostname: 'dbpedia.org',
        port: 443,
        path: '/sparql?query=' + encodeURIComponent(sparqlQuery),
        method: 'GET',
        headers: {
            'Accept': 'text/csv'
        }
    };
    let data = ''
    const dbpedia_request = https.request(options, (dbpedia_res) => {
        console.log('statusCode:', dbpedia_res.statusCode);

        dbpedia_res.on('data', (d) => {

            data += d
            data = data.split('\n')[1] //ignore first line
            if (data=='') {
                console.error('Unfortunetly there is no data for this bird');
                Chat.list_all(req, res, obj);
            } else {
                data = data.split('","') //parse CSV

                console.log(`Data: ${data}`)
                console.log(`data length: ${data.length}`)
    
                
                //copy object
                let new_obj = JSON.parse(JSON.stringify(obj))
    
                //add retrieved data to sighting object
                new_obj.wikiLink = data[0].substring(1); 
                new_obj.imgLink = data[1]
                new_obj.abstract = data[2].substring(0, data[2].length - 1) // remove last character
    
                // console.log(`Sighting object ${new_obj}`)
                Chat.list_all(req, res, new_obj);
            }
        });
    });

    dbpedia_request.on('error', (e) => {
        Chat.list_all(req, res, obj);
        console.error(e);
    });

    dbpedia_request.end();
}


// load the data for a specific sighting
exports.getSightingById = function (req, res, next) {
    Sighting.findById(req.params.sightingId, function (err, obj) {
        if (err)
            console.log(err)
        else
            queryBirdInfoFromDBPedia(req, res, obj);
    });
};






