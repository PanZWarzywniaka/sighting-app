let bodyParser = require("body-parser");
const https = require('https')
//let req = require('request');
let Sighting = require('../models/sightings');
let Chat = require("./chats");
let path = require('path');



/**
 * Create sighting controller used for /add page, parses data from the form
 * and saves new Sighting in database, then redirects to landing page
 * @param {*} req 
 * @param {*} res 
 */
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
        res.redirect('/');
    });
};

exports.createFromSync = function(sightingObj){
    let loc = sightingObj.location.split(",");
    sightingObj.location = {
        type: "Point",
        coordinates: [parseFloat(loc[0]), parseFloat(loc[1])]
    }
    let sighting = new Sighting(sightingObj)
    sighting.save(function (err, results) {
        if (err) {
            console.log(`Error saving sighting during sync ${err}`)
        }
    });
}

/**
 * Queries the database for all sightings and sorts them by proximity.
 * Current user's location is retrieved from request query.
 * If location is not supplied use default location for Sheffield.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.list_nearby = function (req, res, next) {
    // get position of current user to find the nearest sightings
    
    let userLocation;
    
    const userLocationString = req.query.location; //get text value from parameter
    console.log(`userLocationString = ${userLocationString}`)
    if (typeof userLocationString === 'undefined' || userLocationString === '') {
        userLocation = [-1.4701, 53.3811]; //default location
        console.log("Error retrieving location using default one for Sheffield");
    } else {
        const userLocationArray = userLocationString.split(","); //split longituede and latidue
        userLocation = userLocationArray.map(str => parseFloat(str)); //parse to int
        console.log('Got location: ', userLocation)
    }

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

/**
 * Queries the database for all sightings, and sorts them by recency.
 * Then redirects to home page to display results
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
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


/**
 * This controller queries server database to retrieve
 * all sightings created by user.
 * User names is retrieved a query parameter
 * Renders index page with database results
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.list_mine = function (req, res, next) {
    let name = req.query.username;
    console.log(`Listing mine for: ${name}`);
    Sighting.find({ username: name })

        .exec(function (err, sightings) {
            if (err) {
                return next(err)
            }
            else
                res.render('index', { title: 'Bird Sightings', data: sightings })
        })

};

/**
 * This controller is used for viewing a sighting.
 * After retrieving a Sighting from database
 * GET request is sent to DBPedia knowledge graf
 * to retrieve, image, abstract, and link to wikipedia page
 * If request is successfull, controll is passed to Chat.list_all
 * to read all chats from the database
 * @param {*} req 
 * @param {*} res 
 * @param {*} obj Sighting object
 */
function queryBirdInfoFromDBPedia(req, res, obj) {
    let identification = obj['identification'].trim()
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
            if (data == '') {
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


/**
 * Retrieves sighting from MongoDB
 * and calls queryBirdInfoFromDBPedia to enrich
 * sighting info with more information
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getSightingById = function (req, res, next) {
    Sighting.findById(req.params.sightingId, function (err, obj) {
        if (err)
            console.log(err)
        else
            queryBirdInfoFromDBPedia(req, res, obj);
    });
};


/**
 * This controller is used to update Sihtings 
 * identification field. Parameters  to find
 * and update are in request body
 * @param {*} req 
 * @param {*} res 
 */
exports.updateSightingById = function (req, res) {

    let userData = req.body;
    console.log("Updating sighitngs got such data:", userData)
    let sightingId = userData._id
    console.log(`USERNAME IS: ${userData.username}`)

    let newIdentification = userData.new_identification

    Sighting.findByIdAndUpdate(sightingId, { 'identification': newIdentification },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Sighting : ", docs);
            }
        });

    res.redirect(`${req.originalUrl}?username=${userData.username}`); //redirect back after updating
};
